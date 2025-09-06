import { isEmpty, isErr, isItem, isItemEmpty, isNotEmpty, isStrEmpty, isStrNotEmpty, Item } from "./check";

export interface ErrorInfo {
  name: string;
  message: string;
  stack?: string;
  data?: Item;
}

export const getErrorInfo = (source: any, overrides?: Item): ErrorInfo => {
  let { name, message, stack, ...data } = Object.assign(
    {},
    typeof source === "object" ? source : {},
    overrides,
  );
  if (isErr(source)) {
    if (!name) name = source.name;
    if (!message) message = source.message;
    if (!stack) stack = source.stack;
  } else {
    if (!name) name = typeof source;
    if (!message) message = String(source);
  }
  const info: ErrorInfo = { name, message, stack, data };
  if (!isEmpty(stack)) info.stack = stack;
  if (!isEmpty(data)) info.data = data;
  return info;
}

export class Err extends Error {
  data?: { [name: string]: any };

  constructor(public source: any, overrides?: Record<string, any>) {
    super('');
    const info = getErrorInfo(source, overrides);
    Object.assign(this, info);
  }

  merge(data: Item) {
    if (data) this.data = this.data ? { ...this.data, ...data } : data;
    return this;
  }
  
  toJSON() {
    const r: ErrorInfo = { name: this.name, message: this.message };
    if (this.stack) r.stack = this.stack;
    if (isNotEmpty(this.data)) {
      try {
        r.data = JSON.parse(JSON.stringify(this.data));
      }
      catch (e) {
        r.data = getErrorInfo(e);
      }
    }
    return r;
  }

  override toString() {
    const { name, message, data, stack } = this.toJSON();
    let sb = `${name}: ${message}`;
    if (data) sb += ' ' + JSON.stringify(data);
    if (stack) sb += '\n' + stack;
    return sb;
  }
}

export const toErr = (e: any, data?: Item) => (e instanceof Err ? e : new Err(e)).merge(data);
export const throwErr = (e: any, data?: Item) => {
  throw toErr(e, data);
}

export const throwIf = <T>(value: T, check: (value: T) => any, error?: any) => {
  if (check(value)) throwErr(error, { data: { value } });
  return value;
}

// export const toErr = (...args: any[]) => args[0] instanceof Err ? args[0] : new Err(...args);

// export const throwErr = (...args: any[]) => {
//   throw toErr(...args);
// }

export type Fun = (...args: any[]) => any;

interface Catcher {
  <F extends Fun>(fun: F): (...args: Parameters<F>) => ReturnType<F> | undefined;
  <F extends Fun, T>(fun: F, errHandler: T|((e: Err) => T)): (...args: Parameters<F>) => ReturnType<F> | T;
}

export const catcher: Catcher = <T, F extends Fun>(fun: F, errHandler?: (e: Err) => T) => (
  (...args: Parameters<F>): ReturnType<F> | T | undefined => {
    try {
      return fun(...args);
    } catch (error) {
      return typeof errHandler === 'function' ? errHandler(toErr(error)) : errHandler;
    }
  }
);
