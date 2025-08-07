import { toStr } from "./cast";
import { isString } from "./check";
import { stringify } from "./json";

export const compact = (value: any) => value.filter(Boolean) as (string | number | object | Date)[];

export const first = <T>(items: T[]) => items[0];

export const last = <T>(items: T[]) => items[items.length - 1];

export const moveIndex = <T>(items: T[], from: number, to: number) => {
    if (from === to) return items;
    const removes = items.splice(from, 1);
    items.splice(to, 0, removes[0]);
    return items;
};

export const moveItem = <T>(items: T[], item: T, addIndex: number) => {
    const from = items.indexOf(item);
    if (from === -1) return items;
    let to = (from + addIndex) % 5;
    if (to < 0) to += items.length;
    return moveIndex(items, from, to);
};

export const range = (from: number, to: number): number[] => {
    if (to < from) return range(to, from).reverse();
    const r: number[] = [];
    for (let i = from; i <= to; i++) r.push(i);
    return r;
}

export const addItem = <T>(items: T[], item: T) => {
    items.push(item);
    return items;
}

export const replaceIndex = <T>(items: T[], index: number, replace: T) => {
    items[index] = replace;
    return items;
}

export const replaceItem = <T>(items: T[], item: T, replace: T) => {
    const index = items.indexOf(item);
    if (index === -1) return items;
    return replaceIndex(items, index, replace);
}

export const updateIndex = <T>(items: T[], index: number, changes: Partial<T>) =>
    replaceIndex(items, index, { ...items[index], ...changes });

export const updateItem = <T>(items: T[], item: T, changes: Partial<T>) => {
    const index = items.indexOf(item);
    if (index === -1) return items;
    return updateIndex(items, index, changes);
};

export const removeIndex = <T>(items: T[], index: number) => {
    items.splice(index, 1);
    return items;
};

export const removeItem = <T>(items: T[], item: T) => {
    const index = items.indexOf(item);
    if (index === -1) return items;
    return removeIndex(items, index);
};

export const sort = <T = any>(items: T[], prop: (item: T) => string | number | Date = toStr) =>
    items.sort((a, b) => {
        const pA = prop(a);
        const pB = prop(b);
        return isString(pA) || isString(pB)
            ? String(pA).localeCompare(String(pB))
            : Number(pA) - Number(pB);
    });

export const sum = (list: number[], margin?: number) => {
    let r = 0;
    for (const n of list) r += n;
    return r + (list.length - 1) * (margin || 0);
};

export const uniq = <T>(a: T[]): T[] => {
    const o: Record<string, any> = {};
    for (const v of a) {
        o[stringify(v)||String(v)] = v;
    }
    return Object.values(o);
};

export const repeat = <T>(count: number, cb: (i: number) => T): T[] => {
    const r: T[] = [];
    for (let i = 0; i <= count; i++) r.push(cb(i));
    return r;
};