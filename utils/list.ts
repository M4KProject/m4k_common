import { toStr } from './cast';
import { isDef, isStr } from './check';
import { stringify } from './json';

export const compact = <T>(value: T[]) => value.filter(Boolean) as T[];

export const first = <T>(items: T[]) => items[0];

export const last = <T>(items: T[]) => items[items.length - 1];

export const normalizeIndex = (index: number, length: number) => {
  if (length === 0) return 0;
  index = index % length;
  if (index < 0) index += length;
  return index;
};

export const moveIndex = <T>(items: T[], from: number, to: number) => {
  // Normaliser les index avant tout traitement
  from = normalizeIndex(from, items.length);
  to = normalizeIndex(to, items.length);

  if (from === to) return items;

  const removes = items.splice(from, 1);
  items.splice(to, 0, removes[0]);
  return items;
};

export const setItemIndex = <T>(items: T[], item: T, index: number) => {
  const from = items.indexOf(item);
  return moveIndex(items, from, index);
};

export const moveItem = <T>(items: T[], item: T, offset: number) => {
  const from = items.indexOf(item);
  if (from === -1) return items;
  const to = from + offset;
  return moveIndex(items, from, to);
};

export const range = (from: number, to: number): number[] => {
  if (to < from) return range(to, from).reverse();
  const r: number[] = [];
  for (let i = from; i <= to; i++) r.push(i);
  return r;
};

export const addItem = <T>(items: T[], item: T, index?: number) => {
  if (isDef(index)) {
    items.splice(index, 0, item);
  } else {
    items.push(item);
  }
  return items;
};

export const replaceIndex = <T>(items: T[], index: number, replace: T) => {
  items[index] = replace;
  return items;
};

export const replaceItem = <T>(items: T[], item: T, replace: T) => {
  const index = items.indexOf(item);
  if (index === -1) return items;
  return replaceIndex(items, index, replace);
};

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

export const sort = <T = any>(items: T[], prop: (item: T) => string | number | Date = toStr) => {
  const list = items.map((i) => [prop(i), i]) as [string | number | Date, T][];
  list.sort(([a], [b]) =>
    isStr(a) || isStr(b) ? String(a).localeCompare(String(b)) : Number(a) - Number(b)
  );
  items.length = 0;
  items.push(...list.map(([, item]) => item));
  return items;
};

export const sum = (list: number[], margin?: number) => {
  let r = 0;
  for (const n of list) r += n;
  return r + (list.length - 1) * (margin || 0);
};

export const uniq = <T>(a: T[]): T[] => {
  const o: TMap<any> = {};
  for (const v of a) {
    o[stringify(v) || String(v)] = v;
  }
  return Object.values(o);
};

export const repeat = <T>(count: number, cb: (i: number) => T): T[] => {
  const r: T[] = [];
  for (let i = 0; i <= count; i++) r.push(cb(i));
  return r;
};
