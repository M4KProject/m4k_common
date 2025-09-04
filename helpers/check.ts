import { stringify } from "./json";

export const isArray = Array.isArray;

export const isBool = (value: any): value is boolean => value === true || value === false;

export const isDate = (value: any): value is Date => value instanceof Date;

export const isDefined = <T>(value: T | null | undefined): value is NonNullable<T> | null =>
    value !== undefined;

export const isFunction = (value: any): value is (...args: any[]) => any => typeof value === "function";

export const isNil = (value: any): value is null | undefined =>
    value === null || value === undefined;

export const isNotNull = <T>(value: T): value is NonNullable<T> =>
    value !== null && value !== undefined;

export const isNumber = (value: any): value is number => typeof value === 'number';

export const isObject = <T extends {}>(value: unknown): value is T => typeof value === "object" && value !== null;

export const isRecord = <T extends {}>(value: any): value is T => isObject(value) && !isArray(value);

export const isString = (v: any): v is string => typeof v === 'string';

export const isStringNotEmpty = (v: any): v is string => isString(v) && v.length > 0;

export const isStringNotWhite = (v: any): v is string => isString(v) && v.trim().length > 0;

export const isUuid = (value: any): value is string => {
    const code = String(value).replace(/[a-zA-Z0-9]+/g, (a) => '' + a.length);
    return code === '8-4-4-4-12' || code === '32';
};


export const isEmptyRecord = (record: any): boolean => {
    if (!isRecord(record)) return false;
    for (const _ in record) return false;
    return true;
};

export const isEmpty = (value: any): boolean =>
    !value || (isArray(value) ? value.length === 0 : isEmptyRecord(value));

export const isEqual = (a: any, b: any) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (Array.isArray(a)) {
        if (!Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        for (let i = 0, l = a.length; i < l; i++) if (!isEqual(a[i], b[i])) return false;
        return true;
    }
    if (a instanceof Object) {
        if (!isRecord(b)) return false;
        if (Object.keys(a).length !== Object.keys(b).length) return false;
        for (const prop in a) if (!isEqual(a[prop], b[prop])) return false;
        return true;
    }
    return stringify(a) === stringify(b);
};