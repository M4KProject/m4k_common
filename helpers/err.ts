import { toStr } from "./cast";
import { isObject, isString } from "./check";
import { stringify } from "./json";

export class Err extends Error {
  data: any;
  // error: any;
  // args: any[];
  // [key: string]: any;

  constructor(public error: any, data?: any) {
    super('');
    if (error instanceof Error) {
      this.name = error.name;
      this.message = error.message;
    } else {
      this.name = 'Err';
      this.message = toStr(error);
    }
    this.init(data);
  }

  init(data: any) {
    this.data = data;
    if (isObject(data)) {
      if (isString(data.name)) this.name = data.name;
      if (isString(data.message)) this.message = data.message;
    }
    return this;
  }

  // constructor(...args: any[]) {
  //   super('');
  //   this.name = 'Err';
  //   this.args = args;

  //   const sb: string[] = [];
  //   for (const e of args) {
  //     if (e instanceof Error) {
  //       this.error = e;
  //       this.name = e.name;
  //       for (const p of Object.getOwnPropertyNames(e)) {
  //         this[p] = (e as any)[p];
  //       }
  //       break;
  //     } else if (typeof e === "string") {
  //       sb.push(e);
  //     } else if (typeof e === "number") {
  //       sb.push(e.toString());
  //     } else if (typeof e === "object") {
  //       if (e.message) sb.push(e.message);
  //       for (const p in e) {
  //         this[p] = (e as any)[p];
  //       }
  //     }
  //   }
  //   this.message = sb.join(' ');
  // }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      data: this.data,
    };
  }

  toString() {
    return `${this.name}: ${this.message} ${stringify(this.data)}`;
  }
}

export const toErr = (error: any, data?: any) => error instanceof Err ? error.init(data) : new Err(error, data);

export const throwErr = (error: any, data?: any) => {
  throw toErr(error, data);
}

// export const toErr = (...args: any[]) => args[0] instanceof Err ? args[0] : new Err(...args);

// export const throwErr = (...args: any[]) => {
//   throw toErr(...args);
// }

type Fun = (...args: any[]) => any;

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
