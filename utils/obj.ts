import { isDef, isItem, isList, isNil, isObj, isStr, isUndef } from './check';
import { toList } from './cast';
import { last, sort } from './list';
import { nbrMax } from './nbr';
import { Item, List } from './types';
import { isDeepEqual } from './isDeepEqual';

export const sortKey = <T extends Record<any, any>>(record: T): T =>
  Object.fromEntries(sort(Object.entries(record))) as T;

export const getChanges = <T extends Item = Item>(source: T, target: Partial<T>): Partial<T> => {
  if (source === target) return {};
  const changes: Partial<T> = {};
  for (const key in target) {
    if (!isDeepEqual(source[key], target[key])) {
      changes[key] = target[key];
    }
  }
  return changes;
};

export const fisrtKey = (v: Item): string | null => {
  for (const k in v) return k;
  return null;
};

export const lastKey = (v: Item): string | null => last(Object.keys(v));

export const setKey = <T, K extends keyof T>(record: T, key: K, value: T[K]): T => {
  record[key] = value;
  return record;
};

interface DeleteKey {
  <T, K1 extends keyof T>(record: T, k1: K1): Omit<T, K1>;
  <T, K1 extends keyof T, K2 extends keyof T>(record: T, k1: K1, k2: K2): Omit<Omit<T, K1>, K2>;
  <T, K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(
    record: T,
    k1: K1,
    k2: K2,
    k3: K3
  ): Omit<Omit<Omit<T, K1>, K2>, K3>;
  <T>(record: Dictionary<T>, ...keys: string[]): Dictionary<T>;
}
export const deleteKey = ((record: any, ...keys: string[]): any => {
  for (const key of keys) delete record[key];
  return record;
}) as DeleteKey;

export const clear = <T extends Item | List>(v: T): T => {
  if (isList(v)) v.length = 0;
  else if (isItem(v)) for (const key in v) delete v[key];
  return v;
};

export const deepClone = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj === null) return obj;
  let c: any;
  if (isList(obj)) {
    c = [];
    for (let i = 0, l = obj.length; i < l; i++) {
      c[i] = deepClone(obj[i]);
    }
  } else {
    c = {};
    const keys = Object.keys(obj);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      c[key] = deepClone((obj as any)[key]);
    }
  }
  return c as T;
};

export const deleteUndef = <T>(v: T): T => {
  if (isItem(v)) {
    for (const k in v) {
      if (isUndef(v[k])) {
        delete v[k];
      }
    }
  } else if (isList(v)) {
    return (v as any[]).filter(isDef) as any;
  }
  return v;
};

export const merge = (a: any, b: any): any => {
  if (isItem(b)) {
    if (b.$set) return b.$set;
    if (b.$push) return [...toList(a), ...b.$push];
    if (b.$fun) return b.$fun(a, b);
    if (b.$del) return undefined;
  }
  if (isNil(a) || isNil(b) || typeof a !== typeof b) return b;
  if (isItem(a) && isItem(b)) {
    const r: Item = { ...a };
    for (const k in b) {
      r[k] = merge(r[k], b[k]);
      if (isUndef(r[k])) delete r[k];
    }
    return r;
  }
  if (isList(a) && isList(b)) {
    const l = nbrMax(a.length, b.length);
    const r: List = [];
    for (let i = 0; i < l; i++) {
      r[i] = isDef(b[i]) ? merge(a[i], b[i]) : a[i];
    }
    return r;
  }
  return b;
};

export const mergeAll = (...args: any[]): any => args.reduce(merge);

export const deepForEach = (
  obj: any,
  cb: (v: any, k: string | number | null, parent: any) => void
): void => {
  const walk = (v: any, k: string | number | null, parent: any) => {
    if (isObj(v)) {
      if (isList(v)) {
        for (let i = 0, l = v.length; i < l; i++) walk(v[i], i, v);
      } else {
        for (const k in v) walk(v[k], k, v);
      }
    }
    cb(v, k, parent);
  };
  walk(obj, null, null);
};

export const deepMap = (
  obj: any,
  replace: (v: any, k: string | number | null, parent: any) => any
): any => {
  const walk = (v: any, k: string | number | null, parent: any) => {
    if (isObj(v)) {
      if (isList(v)) {
        for (let i = 0, l = v.length; i < l; i++) {
          v[i] = walk(v[i], i, v);
        }
      } else {
        for (const k in v) {
          v[k] = walk(v[k], k, v);
        }
      }
    }
    return replace(v, k, parent);
  };
  return walk(obj, null, null);
};

export const len = (v: any): number =>
isObj(v) ? (isList(v) ? v.length : Object.keys(v).length) : isStr(v) ? v.length : 0;