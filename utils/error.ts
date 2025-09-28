import { toError } from './cast';

export class NotImplemented extends Error {
  constructor(name: string) {
    super(name ? `${name} is not implemented` : 'not implemented');
  }
}
export const notImplemented = (name: string) => new NotImplemented(name);

export class TypeError extends Error {
  constructor(prop?: string, type?: string) {
    super(`${prop || 'property'} is not ${type || 'valid'}`);
  }
}
export const typeError = (prop: string, type: string) => new TypeError(prop, type);

export class TimeoutError extends Error {
  constructor(name: string) {
    super(`${name} timeout`);
  }
}
export const timeoutError = (name: string) => new TimeoutError(name);

export const throwError = (e: any) => {
  throw toError(e);
};
