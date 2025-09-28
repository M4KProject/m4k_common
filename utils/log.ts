import { isDate, isError, isObj } from './check';
import { toError } from './cast';
import { stringify } from './json';

export const logArgToStr = (a: any) =>
  isError(a)
    ? toError(a).toString()
    : isDate(a)
      ? a.toISOString()
      : isObj(a)
        ? stringify(a)
        : String(a);

export const logArgsToStr = (args: any[]) => args.map(logArgToStr).join(' ');
