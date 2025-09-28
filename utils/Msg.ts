import { removeItem } from './list';
import { debounce, throttle } from './async';
import { toVoid } from './cast';
import { isDef, isFun } from './check';
import { global } from './global';
import { getStored, setStored } from './storage';
import { Dictionary } from './types';

export type IMsgHandler<T> = (value: T, oldValue: T) => void;
export type IMsgFilter<T> = (value: T) => boolean;

export interface IMsgSubscription {
  unsubscribe(): void;
}

export interface IMsgSubscribe<T> {
  subscribe(handler: (next: T) => void): IMsgSubscription;
}

export interface IMsgGet<T> {
  get(): T;
}

export interface IMsgSet<T> {
  set(value: T): IMsg<T>;
}

export interface IMsgReadonly<T> extends IMsgGet<T>, IMsgSubscribe<T> {
  readonly key?: string;
  readonly v: T;

  on(h: IMsgHandler<T>): () => void;
  off(h: IMsgHandler<T>): void;

  map<U>(cb: (val: T) => U): IMsgReadonly<U>;
  debounce(ms: number): IMsgReadonly<T>;
  throttle(ms: number): IMsgReadonly<T>;

  pipe(target: IMsgSet<T>): () => void;

  toPromise(filter?: IMsgFilter<T>): Promise<T>;
  dispose(): void;
}

export interface IMsg<T> extends IMsgReadonly<T>, IMsgSet<T> {
  next(value: T | ((value: T) => T)): IMsg<T>;
}

export const msgs: Dictionary<Msg> = global.m4kMsgs || (global.m4kMsgs = {});

export class Msg<T = any> implements IMsg<T> {
  static from<T>(sourceOn: (target: IMsg<T>) => () => void, initValue: T): Msg<T>;
  static from<T>(sourceOn: (target: IMsg<T | undefined>) => () => void): Msg<T | undefined>;
  static from<T>(
    sourceOn: (target: IMsg<T | undefined>) => () => void,
    initValue?: T | undefined
  ): Msg<T | undefined> {
    const target = new Msg<T | undefined>(initValue);
    target.o = () => sourceOn(target);
    target.u = toVoid;
    return target;
  }

  static get<T>(key: string): Msg<T> {
    return msgs[key];
  }

  /** k = key */
  public k?: string;

  /** v = value */
  public v: T;

  /** h = handlers */
  private h: IMsgHandler<T>[] = [];

  /** map and debounce */

  /** upstream lazy: o = onUpstream */
  private o?: (handler: IMsgHandler<any>) => () => void;
  /** upstream lazy: k = offUpstream */
  private c?: () => void;
  /** upstream lazy: u = handlerUpstream */
  private u?: IMsgHandler<any>;
  /** p = parent (source) */
  private p?: Msg;

  /** g = getter */
  private g?: () => T;
  /** s = setter */
  private s?: (next: T) => void;

  constructor(initValue: T, key?: string, isStored?: boolean, storedCheck?: (value: T) => boolean) {
    this.v = initValue;
    this.k = key;
    if (key) msgs[key] = this;
    if (isStored && key) {
      this.v = getStored(key, initValue, storedCheck);
      this.on((next) => setStored(key, next === initValue ? undefined : next));
    }
  }

  get(): T {
    return this.v;
  }

  isEq(a: T, b: T) {
    return a === b;
  }

  set(value: T, ignoreEqual?: boolean) {
    if (ignoreEqual || !this.isEq(this.v, value)) {
      const old = this.v;
      this.v = value;
      this.h.forEach((h) => h(this.v, old));
    }
    return this;
  }

  next(value: T | ((value: T) => T), ignoreEqual?: boolean) {
    return this.set(isFun(value) ? value(this.v) : value, ignoreEqual);
  }

  signal() {
    this.set(this.v, true);
    return this;
  }

  subscribe(handler: (next: T) => void): IMsgSubscription {
    return { unsubscribe: this.on(handler) };
  }

  pipe(target: IMsgSet<T>) {
    target.set(this.v);
    return this.on((val) => target.set(val));
  }

  on(handler: IMsgHandler<T>) {
    this.h.push(handler);
    if (!this.c && this.o && this.u) this.c = this.o(this.u);
    return () => this.off(handler);
  }

  off(handler: IMsgHandler<T>) {
    removeItem(this.h, handler);
    if (this.c && this.h.length === 0) {
      this.c();
      this.c = undefined;
    }
  }

  map<U>(cb: (value: T) => U): IMsgReadonly<U>;
  map<U>(cb: (value: T) => U, handler?: (target: IMsg<U>) => IMsgHandler<any>): IMsgReadonly<U>;
  map<U>(cb: (value: T) => U, handler?: (target: IMsg<U>) => IMsgHandler<any>): IMsgReadonly<U> {
    const source = this;
    const target = new Msg<U>(cb(source.v));

    target.o = (h) => source.on(h);
    target.u = (handler && handler(target)) || ((next: T) => target.set(cb(next)));

    target.p = source;

    return target;
  }

  /**
   * @example
   * a b c - - - d - - e - -
   * - - - - c - - - d - - e
   * @param ms
   * @returns
   */
  debounce(ms: number): IMsgReadonly<T> {
    return this.map(
      () => this.v,
      (target) => debounce((next) => target.set(next), ms)
    );
  }

  /**
   * @example
   * a b c d - - - - e - f g - -
   * a - c - d - - - e - f - g - (2s)
   * a - - d - - - - e - - g - - (3s)
   * a - - - d - - - e - - - g - (4s)
   * @param ms
   * @returns
   */
  throttle(ms: number): IMsgReadonly<T> {
    return this.map(
      () => this.v,
      (target) => throttle((next) => target.set(next), ms)
    );
  }

  toPromise(filter: IMsgFilter<T> = isDef) {
    return new Promise<T>((resolve) => {
      if (filter(this.v)) return resolve(this.v);
      const off = this.on((val) => {
        if (!filter(val)) return;
        off();
        resolve(val);
      });
    });
  }

  getter() {
    return this.g || (this.g = () => this.get());
  }

  setter() {
    return this.s || (this.s = (next: T) => this.set(next));
  }

  dispose() {
    if (this.h.length === 0 && !this.c) return;

    this.h.length = 0;

    if (this.c) {
      this.c();
      this.c = undefined;
    }

    this.p = undefined;
    this.o = undefined;
    this.u = undefined;
    this.g = undefined;
    this.s = undefined;

    if (this.k) {
      delete msgs[this.k];
      this.k = undefined;
    }
  }
}

export const newMsg = <T = any>(
  initValue: T,
  key?: string,
  isStored?: boolean,
  storedCheck?: (value: T) => boolean
) => new Msg<T>(initValue, key, isStored, storedCheck);
