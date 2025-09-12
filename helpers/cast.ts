import { isList, isDate, isNil, isStr, isItem, isPositive } from './check';

export const me = <T = any>(value: T): T => value;

interface ToList {
  <T = any>(v: T[] | T | null | undefined): T[];
  <T = any>(v: any, def: T[]): T[];
}
export const toList = (<T = any>(v: any, def: T[] = []): T[] =>
  isNil(v) ? def : isList(v) ? v : [v]) as ToList;

interface ToBool {
  (v: boolean | string | number): boolean;
  (v: any): boolean | undefined;
  <T>(v: any, defVal: T): boolean | T;
}
export const toBool = (<T = boolean>(v: any, defVal?: T | boolean): boolean | T | undefined =>
  isStr(v)
    ? ['true', 'ok', 'on', '1'].indexOf(String(v).toLowerCase()) !== -1
    : isNil(v)
      ? defVal
      : !!v) as ToBool;

export const toClassName = (obj: any): string => {
  if (!obj) return '';
  const constructor = Object.getPrototypeOf(obj).constructor;
  if (constructor instanceof Function) return obj.name || 'Function';
  return constructor.name;
};

interface ToDate {
  (v: any): Date;
  <TDef>(v: any, defVal: TDef): Date | TDef;
  <TDef>(v: any, defVal?: TDef): Date | TDef | undefined;
}
export const toDate = (<TDef>(v: any, defVal?: TDef): Date | TDef | undefined => (
  isDate(v) ? v :
  isPositive((v = new Date(v)).getTime()) ? v :
  defVal
)) as ToDate;

export const toTime = (v: any): number => isDate(v = toDate(v)) ? v.getTime() : 0;

export const toNull = () => null;

interface ToNumber {
  (v: number): number;
  (v: any): number | undefined;
  <D>(v: any, nanVal: D): number | D;
}
export const toNbr = (<D>(v: any, nanVal?: D): number | D | undefined => {
  const clean = isStr(v) ? v.replace(/,/g, '.').replace(/[^0-9\-\.]/g, '') : String(v);
  const nbr = clean !== '' ? Number(clean) : Number.NaN;
  return Number.isNaN(nbr) || !Number.isFinite(nbr) ? nanVal : nbr;
}) as ToNumber;

interface ToItem {
  <T = any>(value?: T | null | undefined): T & {};
  <T = any, U = any>(value: T | null | undefined, defaultValue: U): T & U & {};
}
export const toItem = ((v: any, d: any) => (isItem(v) ? v : isItem(d) ? d : {})) as ToItem;

interface ToStr {
  (value: any): string;
  <T = any>(value: any, defaultValue: T): string | T;
}
export const toStr = ((v: any, d: any) => (isNil(v) ? d : String(v))) as ToStr;

export const toVoid = () => {};
export const toVoidAsync = () => Promise.resolve();
