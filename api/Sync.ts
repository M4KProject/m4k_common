import { MsgDict } from '@common/utils/MsgDict';
import { Coll, coll, CollOptions, CollWhere } from './Coll';
import { ModelCreate, ModelUpdate } from './models.base';
import { byId } from '@common/utils/by';
import { Dict, isDictOfItem, isEmpty, isList, isStr } from '@common/utils/check';
import { NotImplemented } from '@common/utils/error';
import { Models } from './models';
import { IMsgReadonly } from '@common/utils/Msg';
import { stringify } from '@common/utils/json';

export class Sync<
  K extends keyof Models,
  T extends Models[K] = Models[K],
  Where = CollWhere<T> | CollWhere<T>[],
> {
  readonly name: string;
  readonly up$: IMsgReadonly<Dict<T>>;
  readonly coll: Coll<K, T>;

  private readonly cache: MsgDict<T>;
  private readonly filterMap: Dict<IMsgReadonly<T[]>> = {};
  private readonly findMap: Dict<IMsgReadonly<T>> = {};
  private isInit = false;

  constructor(name: K) {
    this.name = name;
    this.coll = coll(name) as Coll<K, T>;
    this.cache = new MsgDict<T>({}, name + 'Cache', true, isDictOfItem);
    this.up$ = this.cache.throttle(100);
  }

  log(...args: any[]) {
    console.debug('Sync', this.name, ...args);
  }

  byId() {
    return this.cache.v;
  }

  filter(where?: Where, one?: boolean) {
    this.log('find', where, one);
    const items = this.cache.getItems();
    if (isEmpty(where)) return items;

    const whereList = isList(where) ? where : [where];

    const filtersList = whereList.map(where => Object.entries(where).map(([p, filter]) => {
      if (isList(filter)) {
        const [operator, operand] = filter;
        switch (operator) {
          case '=':
            return (v: any) => v[p] === operand;
          case '!=':
            return (v: any) => v[p] !== operand;
          case '>':
            return (v: any) => v[p] > operand;
          case '>=':
            return (v: any) => v[p] >= operand;
          case '<':
            return (v: any) => v[p] < operand;
          case '<=':
            return (v: any) => v[p] <= operand;
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
        return (v: any) => v[p] === filter;
      }
    }));

    const filter = (i) => filtersList.find(filters => filters.every(f => f(i)));

    const results = one ? [items.find(filter)] : items.filter(filter);
    return results;
  }

  get(where?: string|Where) {
    if (!where) return undefined;
    if (isStr(where)) return this.cache.getItem(where);
    return this.filter(where, true)[0];
  }

  async load() {
    this.log('load');
    const items = await this.coll.all();
    const changes: Dict<T | null> = byId(items);
    const prev = this.filter();
    const deletedIds = prev.filter((i) => !changes[i.id]).map(r => r.id);
    for (const id of deletedIds) changes[id] = null;
    this.cache.update(changes);
  }

  init() {
    if (!this.isInit) {
      this.isInit = true;
      this.log('init');
      this.coll.on((item, action) => {
        this.set(item.id, action === 'delete' ? null : item);
      });
      this.load();
    }
  }
  
  filter$(where?: Where) {
    this.init();
    const key = isStr(where) ? where : stringify(where);
    const map = this.filterMap;
    return map[key] || (map[key] = this.cache.map(() => this.filter(where)));
  }

  find$(where?: string|Where) {
    this.init();
    const key = isStr(where) ? where : stringify(where);
    const map = this.findMap;
    return map[key] || (map[key] = this.cache.map(() => this.get(where)));
  }

  private set(id: string, item: T|null) {
    this.cache.setItem(id, item);
  }

  async create(item: ModelCreate<T>, o?: CollOptions<T>): Promise<T> {
    this.log('create', item, o);
    const result = await this.coll.create(item, o);
    this.set(result.id, result);
    return result;
  }

  async update(id: string, changes: ModelUpdate<T>, o?: CollOptions<T>): Promise<T | null> {
    const prev = this.get(id);
    this.set(id, { ...prev, ...changes });
    try {
      const result = await this.coll.update(id, changes, o);
      const next = { ...prev, ...changes, ...result };
      this.set(id, next);
      return next;
    }
    catch(e) {
      this.set(id, prev);
      throw e;
    }
  }

  async delete(id: string, o?: CollOptions<T>): Promise<void> {
    const prev = this.get(id);
    this.set(id, null);
    try {
      await this.coll.delete(id, o);
    }
    catch(e) {
      this.set(id, prev);
      throw e;
    }
  }
}

export type SyncByName = {
  [K in keyof Models]: Sync<K>;
};

const _syncs = {} as Partial<SyncByName>;

export const sync = <K extends keyof Models>(name: K): Sync<K> =>
  _syncs[name] || ((_syncs[name] as Sync<K>) = new Sync<K>(name));
