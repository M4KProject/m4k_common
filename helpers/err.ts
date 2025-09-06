import { isEmpty, isErr, isItem, isItemEmpty, isStrEmpty, isStrValid, Item } from "./check";

export interface ErrorInfo {
  name: string;
  message: string;
  stack?: string;
  data?: { [name: string]: any };
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

  merge({ name, message, stack, data }: Partial<ErrorInfo>) {
    if (name) this.name = name;
    if (message) this.message = message;
    if (stack) this.stack = stack;
    if (data) this.data = { ...this.data, ...data };
    return this;
  }
  
  toJSON() {
    const r: ErrorInfo = { name: this.name, message: this.message };
    if (this.stack) r.stack = this.stack;
    if (this.data) {
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
    const j = this.toJSON();
    return `${j.name}: ${j.message}\n${JSON.stringify(j.data, null, 2)}\n${j.stack}`;
  }
}

export const toErr = (e: any, info?: Partial<ErrorInfo>) => (e instanceof Err ? e : new Err(e)).merge(info);
export const throwErr = (e: any, info?: Partial<ErrorInfo>) => {
  throw toErr(e, info);
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
