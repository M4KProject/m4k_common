import { MsgDict } from "@common/utils/MsgDict";
import { Coll, CollOptions, CollWhere } from "./Coll";
import { ModelBase, ModelCreate, ModelUpdate } from "./models.base";
import { byId } from "@common/utils/by";
import { Dict, isEmpty, isList, isStr } from "@common/utils/check";
import { NotImplemented } from "@common/utils/error";
import { Models } from "./models";
import { toVoid } from "@common/utils";

export class CollSync<K extends keyof Models, T extends Models[K] = Models[K]> extends Coll<K, T> {
  cache: MsgDict<T>;
  onCount = 0;
  off = toVoid;

  on() {
    this.onCount++;
    if (this.onCount === 1) {
      this.off = this.subscribe('*');
    }
    return () => {
      this.onCount--;
      setTimeout(() => {
        if (this.onCount <= 0) {
          this.onCount = 0;
          this.off();
          this.off = toVoid;
        }
      }, 10);
    }
  }

  findCache(where?: CollWhere<T>) {
    const items = this.cache.getItems();
    if (!isEmpty(where)) return items;

    const filters = Object.entries(where).map(([prop, filter]) => {
      if (isList(filter)) {
        const [operator, operand] = filter;
        switch (operator) {
          case '=': (v: any) => v === operand;
          case '!=': (v: any) => v !== operand;
          case '>': (v: any) => v > operand;
          case '>=': (v: any) => v >= operand;
          case '<': (v: any) => v < operand;
          case '<=': (v: any) => v <= operand;
          // case '~':   // Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
          // case '!~':  // NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
          // case '?=':  // Any/At least one of Equal
          // case '?!=': // Any/At least one of NOT equal
          // case '?>':  // Any/At least one of Greater than
          // case '?>=': // Any/At least one of Greater than or equal
          // case '?<':  // Any/At least one of Less than
          // case '?<=': // Any/At least one of Less than or equal
          // case '?~':  // Any/At least one of Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
          // case '?!~': // Any/At least one of NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
          default:
            throw new NotImplemented(`operator "${operator}"`);
        }
      } else {
        return (v: any) => v === filter;
      }
    });
    return items.filter(item => !filters.find(f => !f(item)));
  }

  findPage(where: CollWhere<T>, o?: CollOptions<T>) {
    return super.findPage(where, o).then(page => {
      debugger;
      const changes: Dict<T|undefined> = byId(page.items);
      if (page.totalPages === 1) {
        const prev = this.findCache(where);
        const deletedIds = prev.filter(i => !changes[i.id]);
        for (const id of deletedIds) {
          (changes as any)[id] = undefined;
        }
        this.cache.merge(changes);
      }
      this.cache.merge(changes);
      return page;
    });
  }

  create(item: ModelCreate<T>, o?: CollOptions<T>): Promise<T> {
    return super.create(item, o).then(result => {
      this.cache.update({ [result.id]: { ...item, ...result } });
      return result;
    });
  }

  update(
    id: string | CollWhere<T>,
    changes: ModelUpdate<T>,
    o?: CollOptions<T>
  ): Promise<T | null> {
    return super.update(id, changes, o).then(result => {
      if (isStr(id)) {
        const prev = this.cache.getItem(id);
        this.cache.update({ [id]: { ...prev, ...changes, ...result } });
      }
      return result;
    });
  }

  up(id: string | CollWhere<T>, changes: ModelUpdate<T>, o?: CollOptions<T>) {
    return this.update(id, changes, { ...o, select: [] }).then(Boolean);
  }

  delete(id: string, o?: CollOptions<T>): Promise<void> {
    return super.delete(id, o).then(result => {
      this.cache.update({ [id]: undefined });
      return result;
    });
  }

  subscribe(
    topic: string,
    cb?: (item: T, action: 'update' | 'create' | 'delete') => void,
    o?: CollOptions<T>
  ) {
    return super.subscribe(topic, (item, action) => {
      this.cache.update({ [item.id]: action === 'delete' ? undefined : item });
      cb && cb(item, action);
    }, o);
  }
}

export type CollSyncByName = {
  [K in keyof Models]: CollSync<K>;
};

const _colls = {} as Partial<CollSyncByName>;

export const collSync = <K extends keyof Models>(name: K): CollSync<K> => (
  _colls[name] || (
    (_colls[name] as CollSync<K>) = new CollSync<K>(name)
  )
);
