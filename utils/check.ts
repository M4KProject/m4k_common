export type Dict<T = any> = Record<string, T>;
export type List<T = any> = T[];
export type Item = Dict<any>;
export type Obj = Item | List;

///// Type /////
export const isObj = <T extends Obj>(v: unknown): v is T => typeof v === 'object' && v !== null;
export const isList = (v: any): v is List => Array.isArray(v);
export const isItem = <T extends Item>(v: any): v is T => isObj(v) && !isList(v);
export const isBool = (v: any): v is boolean => v === true || v === false;
export const isDate = (v: any): v is Date => v instanceof Date;
export const isErr = (v: any): v is Error => v instanceof Error;
export const isFile = (v: any): v is File => v instanceof File;
export const isBlob = (v: any): v is Blob => v instanceof Blob;
export const isFileOrBlob = (v: any): v is File | Blob => isFile(v) || isBlob(v);
export const isFun = (v: any): v is (...args: any[]) => any => typeof v === 'function';
export const isNbr = (v: any): v is number => typeof v === 'number';
export const isNot = (is: (v: any) => boolean) => (v: any) => !is(v);

///// Null /////
export const isUndef = <T>(v: T | null | undefined): v is undefined => v === undefined;
export const isDef = <T>(v: T | null | undefined): v is NonNullable<T> | null => v !== undefined;
export const isNil = (v: any): v is null | undefined => v === null || v === undefined;
export const isNotNil = <T>(v: T | null | undefined): v is NonNullable<T> => !isNil(v);

///// Number /////
export const isReal = (v: any): v is number => isNbr(v) && !Number.isNaN(v) && Number.isFinite(v);
export const isPositive = (v: any): v is number => isReal(v) && v > 0;
export const isNegative = (v: any): v is number => isReal(v) && v < 0;
export const isInt = (v: any): v is number => isReal(v) && Number.isInteger(v);
export const isBetween = (v: number, min?: number, max?: number): boolean =>
  isNbr(min) && v < min ? false : isNbr(max) && v > max ? false : true;

///// String /////
export const isStr = (v: any): v is string => typeof v === 'string';
export const isStrEmpty = (v: any): v is string => isStr(v) && v.trim() === '';
export const isStrNotEmpty = (v: any): v is string => isStr(v) && v.trim() !== '';
export const isUuid = (v: any): v is string => {
  const code = String(v).replace(/[a-fA-F0-9]+/g, (a) => '' + a.length);
  return code === '8-4-4-4-12' || code === '32';
};

///// Empty /////
export const isListOf =
  <T>(is: (v: any) => v is T) =>
  (v: any): v is T[] =>
    isList(v) && v.every(is);
export const isDictOf =
  <T>(is: (v: any) => v is T) =>
  (v: any): v is Dict<T> =>
    isItem(v) && Object.values(v).every(is);
export const isListOfItem = isListOf(isItem);
export const isDictOfItem = isDictOf(isItem);

export const isListEmpty = (v: any): boolean => isList(v) && v.length === 0;
export const isItemEmpty = (v: any): boolean => {
  if (!isItem(v)) return false;
  for (const _ in v) return false;
  return true;
};
export const isObjEmpty = (v: Obj): boolean => isListEmpty(v) || isItemEmpty(v);
export const isEmpty = (v: any): boolean => isNil(v) || (isStr(v) ? isStrEmpty(v) : isObjEmpty(v));
export const isNotEmpty = isNot(isEmpty);

///// DeepEqual /////
export const len = (v: any): number =>
  isObj(v) ? (isList(v) ? v.length : Object.keys(v).length) : isStr(v) ? v.length : 0;
export const isEq = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (isList(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0, l = a.length; i < l; i++) if (!isEq(a[i], b[i])) return false;
    return true;
  }
  if (isItem(a)) {
    if (len(a) !== len(b)) return false;
    for (const p in a) if (!isEq(a[p], b[p])) return false;
    return true;
  }
  return false;
};
export const isNotEq = (a: any, b: any): boolean => !isEq(a, b);
