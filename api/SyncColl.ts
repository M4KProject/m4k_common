import { coll, Coll } from './Coll';
import { ModelBase, ModelCreate, ModelUpdate } from './models';
import { IMsgReadonly, Msg } from '../utils/Msg';
import { Dict, isEmpty, isEq, List } from '../utils/check';
import { byId } from '../utils/by';
import { first } from '../utils/list';
import { ReqError } from '../utils/req';
import { firstUpper, uuid } from '../utils/str';
import { toError, toVoidAsync } from '../utils/cast';

export interface Todo<T extends ModelBase> {
  id: string;
  prev: T|null;
  next: T|null;
}

export class SyncColl<T extends ModelBase> {
  public coll: Coll<T>;

  public dict$: Msg<Dict<T>>;
  public list$: IMsgReadonly<List<T>>;

  private todo$: Msg<Record<string, Todo<T>>>;
  private isInit = false;
  private isFlush = false;
  private unsubscribe = toVoidAsync;

  constructor(public collName: string, key?: string) {
    this.coll = coll<T>(collName);

    this.dict$ = new Msg<Record<string, T>>({}, key, true);
    this.list$ = this.dict$.map(Object.values) as IMsgReadonly<T[]>;

    this.todo$ = new Msg<Record<string, Todo<T>>>({});
    this.todo$.throttle(500).on(this.flush.bind(this));

    global['sync' + firstUpper(this.collName)] = this;
  }

  async flush(): Promise<void> {
    if (this.isFlush) return;

    const todos = Object.values(this.todo$.v);
    if (isEmpty(todos)) return;

    const todo = first(todos);

    try {
      this.isFlush = true;
      this.todo$.delete(todo.id);
      const { prev, next } = todo;

      if (prev && !next) {
        await this.coll.delete(prev.id);
      }
      else if (!prev && next) {
        const item = await this.coll.create({ ...next, id: undefined });
        this.dict$.apply(dict => {
          dict[item.id] = item;
          delete dict[todo.id];
        });
      }
      else {
        const changes = { ...prev, ...next };
        for (const key in changes) {
          const vPrev = prev[key];
          const vNext = next[key];
          if (isEq(vPrev, vNext)) {
            delete changes[key];
            continue;
          }
        }
        if (!isEmpty(changes)) {
          await this.coll.update(prev.id, changes);
        }
      }
    } catch (error) {
      if (error instanceof ReqError) {
        // if (!isBetween(error.status, 400, 499)) {
        //   this.todo$.merge({ [todo.id]: todo });
        //   return;
        // }
        console.error('sync flush error req', error.status, error);
      } else {
        console.error('sync flush error', error);
      }
    } finally {
      this.isFlush = false;
    }

    await this.flush();
  }

  async load(): Promise<void> {
    try {
      await this.flush();
      const list = await this.coll.find({});
      const dict = byId(list);
      this.dict$.set(dict);
    }
    catch(e) {
      const error = toError(e);
      console.error('sync load error', this.collName, error);
      throw error;
    }
  }

  async init(): Promise<void> {
    if (this.isInit) return;

    console.debug('sync init', this.collName);

    try {
      await this.load();

      this.unsubscribe();
      this.unsubscribe = await this.coll.subscribe('*', this.onEvent.bind(this));

      this.isInit = true;
    } catch (error) {
      console.error('SyncColl init error:', error);
      throw error;
    }
  }

  get(id: string): T|undefined {
    return this.dict$.v[id];
  }

  set(id: string, next: T|null): void {
    this.dict$.apply(dict => {
      const todo = { ...this.todo$.v[id], id, next };
      if (!todo.prev) todo.prev = dict[id];

      if (next) {
        dict[id] = next;
      }
      else {
        delete dict[id];
      }

      this.todo$.merge({ [id]: todo });
    });
  }

  create(next: ModelCreate<T>): void {
    const id = uuid();
    this.set(id, { ...next, id } as T);
  }

  update(id: string, changes: ModelUpdate<T>): void {
    this.set(id, { ...this.get(id), ...changes });
  }

  delete(id: string): void {
    this.set(id, null);
  }

  private onEvent(item: T, action: 'update' | 'create' | 'delete'): void {
    this.dict$.apply(next => {
      if (action === 'delete') {
        delete next[item.id];
        return;
      }
      if (action === 'create' || action === 'update') {
        next[item.id] = item;
        return;
      }
      console.warn('sync unknown action', action);
    });
  }

  dispose(): void {
    this.unsubscribe();
    this.dict$.dispose();
    this.todo$.dispose();
  }
}
