export type Item = { [prop: string]: any };
export type List = any[];
export type Obj = Item|List;

export const isList = Array.isArray;
export const isBool = (v: any): v is boolean => v === true || v === false;
export const isDate = (v: any): v is Date => v instanceof Date;
export const isErr = (v: any): v is Error => v instanceof Error;
export const isDef = <T>(value: T | null | undefined): value is NonNullable<T> | null => value !== undefined;
export const isFun = (value: any): value is (...args: any[]) => any => typeof value === "function";
export const isNil = (value: any): value is null | undefined => value === null || value === undefined;
export const isNotNil = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined;
export const isNbr = (v: any): v is number => typeof v === 'number';
export const isFiniteNbr = (v: any): v is number => isNbr(v) && !Number.isNaN(v) && Number.isFinite(v);
export const isInt = (v: any): v is number => isFiniteNbr(v) && Number.isInteger(v);
export const isObj = <T extends Obj>(value: unknown): value is T => typeof value === "object" && value !== null;
export const isItem = <T extends Item>(value: any): value is T => isObj(value) && !isList(value);
export const isListOf = <T>(v: any, is: (c: any) => c is T): v is T[] => isList(v) && v.every(is);
export const isListOfItem = <T extends Item>(v: any): v is T[] => isListOf(v, isItem);
export const isStr = (v: any): v is string => typeof v === 'string';
export const isStrEmpty = (s: string) => s === "";
export const isStrWhite = (s: string) => s.trim() === "";
export const isStrDefined = (v: any): v is string => isStr(v) && !isStrWhite(v);
export const isUuid = (v: any): v is string => {
    const code = String(v).replace(/[a-fA-F0-9]+/g, (a) => '' + a.length);
    return code === '8-4-4-4-12' || code === '32';
};
export const isListEmpty = (v: any): boolean => isList(v) && v.length === 0;
export const isItemEmpty = (v: any): boolean => {
    if (isItem) for (const _ in v) return false;
    return true;
}
export const isObjEmpty = (obj: Obj): boolean => isList(obj) ? isListEmpty(obj) : isItemEmpty(obj);
export const isEmpty = (v: any): boolean => v === "" || isObjEmpty(v);
export const isEq = (a: any, b: any) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (isList(a)) {
        if (!isList(b)) return false;
        if (a.length !== b.length) return false;
        for (let i = 0, l = a.length; i < l; i++) if (!isEq(a[i], b[i])) return false;
        return true;
    }
    if (a instanceof Object) {
        if (!isItem(b)) return false;
        if (Object.keys(a).length !== Object.keys(b).length) return false;
        for (const prop in a) if (!isEq(a[prop], b[prop])) return false;
        return true;
    }
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    catch (e) {
        return false;
    }
};