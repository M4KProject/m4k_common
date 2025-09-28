import { isItemEmpty, isNil } from './check';
import { merge } from './obj';
import { Msg } from './Msg';
import { Dictionary, Item } from './types';

export class MsgDict<T extends Item> extends Msg<Dictionary<T>> {
  apply(cb: (next: Dictionary<T>) => void) {
    const prev = this.v;
    const next = { ...prev };
    cb(next);
    this.set(next);
    return this;
  }

  merge(changes: Dictionary<Partial<T>>, isReplace?: boolean) {
    const prev = this.v;
    if (!prev) return this;

    for (const key in changes) {
      if (changes[key] === prev[key]) {
        delete changes[key];
      }
    }

    if (isItemEmpty(changes)) return this;

    const next = { ...prev };

    for (const key in changes) {
      if (isNil(changes[key])) {
        delete next[key];
      } else if (!isReplace) {
        next[key] = merge(next[key], changes[key]);
      } else {
        next[key] = changes[key] as T;
      }
    }

    return this.set(next as T);
  }

  update(changes: Dictionary<T>) {
    return this.merge(changes, true);
  }

  getItem(id: string): T | undefined {
    return this.v[id];
  }

  setItem(id: string, item: T | undefined) {
    return this.update({ [id]: item });
  }

  delete(id: string) {
    return this.update({ [id]: null });
  }

  getItems() {
    return Object.values(this.v);
  }
}

export const newMsgDict = <T extends {} = Item>(
  initValue: T,
  key?: string,
  isStored?: boolean,
  storedCheck?: (value: T) => boolean
) => new MsgDict<T>(initValue, key, isStored, storedCheck);
