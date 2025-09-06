export type Item = { [prop: string]: any };
export type List = any[];
export type Obj = Item|List;

///// Type /////
export const isObj = <T extends Obj>(v: unknown): v is T => typeof v === "object" && v !== null;
export const isList = (v: any): v is any[] => Array.isArray(v);
export const isItem = <T extends Item>(v: any): v is T => isObj(v) && !isList(v);
export const isBool = (v: any): v is boolean => v === true || v === false;
export const isDate = (v: any): v is Date => v instanceof Date;
export const isErr = (v: any): v is Error => v instanceof Error;
export const isFun = (v: any): v is (...args: any[]) => any => typeof v === "function";
export const isNbr = (v: any): v is number => typeof v === 'number';
export const isNot = (is: (v: any) => boolean) => (v: any) => !is(v);

///// Null /////
export const isUndef = <T>(v: T | null | undefined): v is undefined => v === undefined;
export const isDef = <T>(v: T | null | undefined): v is NonNullable<T> | null => v !== undefined;
export const isNil = (v: any): v is null | undefined => v === null || v === undefined;
export const isNotNil = <T>(v: T | null | undefined): v is NonNullable<T> => !isNil(v);

///// Number /////
export const isNbrReal = (v: any): v is number => isNbr(v) && !Number.isNaN(v) && Number.isFinite(v);
export const isInt = (v: any): v is number => isNbrReal(v) && Number.isInteger(v);

///// String /////
export const isStr = (v: any): v is string => typeof v === 'string';
export const isStrEmpty = (v: any): v is string => isStr(v) && v.trim() === "";
export const isStrNotEmpty = (v: any): v is string => isStr(v) && v.trim() !== "";
export const isUuid = (v: any): v is string => {
    const code = String(v).replace(/[a-fA-F0-9]+/g, (a) => '' + a.length);
    return code === '8-4-4-4-12' || code === '32';
};

///// Empty /////
export const isListOf = <T>(v: any, is: (c: any) => c is T): v is T[] => isList(v) && v.every(is);
export const isListOfItem = <T extends Item>(v: any): v is T[] => isListOf(v, isItem);

export const isListEmpty = (v: any): boolean => isList(v) && v.length === 0;
export const isItemEmpty = (v: any): boolean => {
    if (isItem(v)) for (const _ in v) return false;
    return true;
}
export const isObjEmpty = (v: Obj): boolean => isListEmpty(v) || isItemEmpty(v);
export const isEmpty = (v: any): boolean => isNil(v) || isStrEmpty(v) || isObjEmpty(v);
export const isNotEmpty = isNot(isEmpty);

///// DeepEqual /////
export const isEq = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (isList(a)) {
        if (a.length !== b.length) return false;
        for (let i = 0, l = a.length; i < l; i++)
            if (!isEq(a[i], b[i]))
                return false;
        return true;
    }
    if (isItem(a)) {
        if (Object.keys(a).length !== Object.keys(b).length) return false;
        for (const p in a)
            if (!isEq(a[p], b[p]))
                return false;
        return true;
    }
    return false;
};
export const isNotEq = (a: any, b: any): boolean => !isEq(a, b);