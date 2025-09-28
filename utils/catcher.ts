import { isFun } from './check';
import { Fun } from './types';

interface Catcher {
  <F extends Fun>(fun: F): (...args: Parameters<F>) => ReturnType<F> | undefined;
  <F extends Fun, T>(
    fun: F,
    errHandler: T | ((e: Error) => T)
  ): (...args: Parameters<F>) => ReturnType<F> | T;
}

export const catcher: Catcher =
  <T, F extends Fun>(fun: F, errHandler?: (e: any) => T) =>
  (...args: Parameters<F>): ReturnType<F> | T | undefined => {
    try {
      return fun(...args);
    } catch (e) {
      return isFun(errHandler) ? errHandler(e) : errHandler;
    }
  };
