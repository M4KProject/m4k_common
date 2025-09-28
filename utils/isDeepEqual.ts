import { isItem, isList } from "./check";
import { len } from "./obj";

export const isDeepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (isList(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0, l = a.length; i < l; i++) if (!isDeepEqual(a[i], b[i])) return false;
    return true;
  }
  if (isItem(a)) {
    if (len(a) !== len(b)) return false;
    for (const p in a) if (!isDeepEqual(a[p], b[p])) return false;
    return true;
  }
  return false;
};
