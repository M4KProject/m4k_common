import { isDate, isError, isList, isObj } from './check';
import { toError } from './cast';
import { stringify } from './json';

export const humanize = (a: any): string =>
  isList(a)
    ? a.map(humanize).join(' ')
    : isError(a)
      ? toError(a).toString()
      : isDate(a)
        ? a.toISOString()
        : isObj(a)
          ? stringify(a)
          : String(a);
