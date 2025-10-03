import { isItem, isList } from './check';
import { Item, List } from './types';

export const parse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return e;
  }
};

export const stringify = (
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): string => {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (_) {}

  try {
    if (isList(value)) {
      const list: List = [];
      for (const child of value) {
        try {
          JSON.stringify(child);
          list.push(child);
        } catch (e) {
          list.push(String(child));
        }
      }
      return JSON.stringify(list, null, space);
    }

    if (isItem(value)) {
      const item: Item = { ...value };
      for (const key in value) {
        try {
          JSON.stringify(value[key]);
        } catch (e) {
          item[key] = String(value[key]);
        }
      }
      return JSON.stringify(item, replacer, space);
    }
  } catch (_) {}

  return String(value);
};

export const cloneJson = <T>(value: T) => parse(stringify(value)) as T;
