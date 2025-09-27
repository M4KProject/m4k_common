import { Keys, ModelBase, ModelCreate, Models, ModelUpdate } from './models';
import { isList, isDef, isEmpty } from '../utils/check';
import { removeItem } from '../utils/list';
import { parse, stringify } from '../utils/json';
import { realtime } from './realtime';
import { Req, ReqOptions, ReqParams } from '../utils/req';
import { toError } from '../utils/cast';
import { getUrl, Thumb } from './getUrl';
import { deepClone, getChanges } from '@common/utils/obj';
import { newApiReq } from './apiReq';

export type Operator =
  | '=' // Equal
  | '!=' // NOT equal
  | '>' // Greater than
  | '>=' // Greater than or equal
  | '<' // Less than
  | '<=' // Less than or equal
  | '~' // Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
  | '!~' // NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
  | '?=' // Any/At least one of Equal
  | '?!=' // Any/At least one of NOT equal
  | '?>' // Any/At least one of Greater than
  | '?>=' // Any/At least one of Greater than or equal
  | '?<' // Any/At least one of Less than
  | '?<=' // Any/At least one of Less than or equal
  | '?~' // Any/At least one of Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
  | '?!~'; // Any/At least one of NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)

export type Operand = string | number | null | boolean | Date;
export type Filter = Operand | [Operator, Operand];
export type WhereItem<T extends ModelBase> = { [P in keyof T]?: Filter };
export type Where<T extends ModelBase> = WhereItem<T> | WhereItem<T>[];

export interface CollOptions<T extends ModelBase> {
  select?: Keys<T>[];
  where?: Where<T>;
  orderBy?: (Keys<T> | `-${Keys<T>}`)[];
  expand?: string;
  page?: number;
  perPage?: number;
  skipTotal?: boolean;
  headers?: Record<string, string>;
  intervalMs?: number;
  req?: ReqOptions<T>;
}

const stringifyFilter = (key: string, propFilter: Filter) => {
  const [operator, operand] = isList(propFilter) ? propFilter : ['=', propFilter];

  const operandString =
    typeof operand === 'string'
      ? `"${operand}"`
      : operand instanceof Date
        ? stringify(operand)
        : operand;

  return `${key} ${operator} ${operandString}`;
};

const stringifyWhere = <T extends ModelBase>(where: Where<T> | undefined): string | undefined => {
  if (!where) return undefined;

  const filters = Object.entries(where || {})
    .map(([k, f]) => (isDef(f) ? stringifyFilter(k, f) : ''))
    .filter((f) => f);
  if (filters.length === 0) return undefined;

  return `(${filters.join(' && ')})`;
};

export const getParams = (o?: CollOptions<any>): ReqParams => {
  if (!o) return {};

  const { select, where, orderBy, expand, page, perPage, skipTotal } = o;

  const r: ReqParams = {};

  if (orderBy) r.sort = orderBy.join(',');
  if (select) r.fields = select.join(',');
  if (expand) r.expand = expand;
  if (page) r.page = page;
  if (perPage) r.perPage = perPage;
  if (skipTotal) r.skipTotal = 'true';

  const filter = stringifyWhere(where);
  if (filter) r.filter = filter;

  return r;
};

export class Coll<T extends ModelBase> {
  public readonly name: string;
  private readonly unsubscribes: (() => void)[] = [];
  readonly r: Req;

  constructor(name: string) {
    this.name = name;
    this.r = newApiReq(`collections/${name}/`);
  }

  private log(...args: any[]) {
    console.debug('Coll', this.name, ...args);
  }

  get(id: string, o?: CollOptions<T>): Promise<T | null> {
    this.log('get', id, o);
    if (!id) return Promise.resolve(null);
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('GET', `records/${id}`, {
      ...reqOptions,
      params: {
        ...getParams(o),
        ...reqOptions.params,
      },
    });
  }

  getPage(where: Where<T>, o?: CollOptions<T>) {
    this.log('findPage', where, o);
    const reqOptions: ReqOptions = o?.req || {};
    return this.r<{
      items: T[];
      page: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    }>('GET', `records`, {
      ...reqOptions,
      params: getParams({ where, ...o } as CollOptions<T>),
    });
  }

  filter(where: Where<T>, o?: CollOptions<T>) {
    return this.getPage(where, { page: 1, perPage: 1000, skipTotal: true, ...o }).then(
      (r) => r.items
    );
  }

  all(o?: CollOptions<T>) {
    return this.filter({}, o);
  }

  one(where: Where<T>, o?: CollOptions<T>): Promise<T | null> {
    return this.getPage(where, { page: 1, perPage: 1, skipTotal: true, ...o }).then(
      (r) => r.items[0] || null
    );
  }

  findId(where: Where<T>, o?: CollOptions<T>): Promise<string | null> {
    return this.one(where, { ...o, select: ['id' as Keys<T>] }).then((r) => r?.id);
  }

  findKey(key: string, o?: CollOptions<T>): Promise<T | null> {
    return this.one({ key } as Where<T>, o).then((result) => {
      if (!result) return this.get(key, o);
      return result;
    });
  }

  count(where: Where<T>, o?: CollOptions<T>) {
    return this.getPage(where, { page: 1, perPage: 1, ...o }).then((r) => r.totalItems);
  }

  create(item: ModelCreate<T>, o?: CollOptions<T>): Promise<T> {
    this.log('create', item, o);
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('POST', `records`, {
      ...reqOptions,
      params: getParams(o),
      form: item,
    });
  }

  update(id: string, changes: ModelUpdate<T>, o?: CollOptions<T>): Promise<T | null> {
    this.log('update', id, changes, o);
    if (!id) throw toError('no id');
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('PATCH', `records/${id}`, {
      ...reqOptions,
      params: getParams(o),
      form: changes,
    });
  }

  up(id: string, changes: ModelUpdate<T>, o?: CollOptions<T>) {
    return this.update(id, changes, { ...o, select: [] }).then(Boolean);
  }

  delete(id: string, o?: CollOptions<T>): Promise<void> {
    this.log('delete', id, o);
    if (!id) throw toError('no id');
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('DELETE', `records/${id}`, {
      ...reqOptions,
      params: getParams(o),
      resType: 'text',
    });
  }

  upsert(where: Where<T>, changes: ModelCreate<T>, o?: CollOptions<T>) {
    this.log('upsert', where, changes, o);
    return this.findId(where).then((id) =>
      id ? (this.update(id, changes, o) as Promise<T>) : this.create(changes, o)
    );
  }

  async apply(
    id: string,
    cb: (prev: T) => void | Promise<void>,
    o?: CollOptions<T>
  ): Promise<T | null> {
    const prev = await this.get(id, o);
    const next = deepClone(prev);
    await cb(next);
    const changes = getChanges(prev, next);
    if (isEmpty(changes)) return prev;
    return await this.update(id, changes, o);
  }

  getUrl(id?: string, filename?: any, thumb?: Thumb) {
    return getUrl(this.name, id, filename, thumb);
  }

  on(
    cb: (item: T, action: 'update' | 'create' | 'delete') => void,
    topic: string = '*',
    o?: CollOptions<T>
  ) {
    console.debug('on', this.name, topic, o);
    // 'devices/8e2mu4rr32b0glf?options={"headers": {"x-token": "..."}}'

    const p = getParams(o);
    const keyOptions = encodeURIComponent(
      stringify({
        query: p.query,
        headers: p.headers,
      })
    );
    let key = `${this.name}/${topic}`;
    if (p.query || p.headers) key += `?options=${keyOptions}`;

    console.debug('subscribe key', this.name, key);

    const listener = (event: MessageEvent) => {
      // console.debug('subscribe listener', this.coll, key, event);
      const payload = parse(event.data);
      const record = (payload ? payload.record : null) || payload;
      const id = (record ? record.id : null) || record;
      console.debug('subscribe listener payload', this.name, key, id);
      cb(record, payload.action);
    };

    const subscriptions = realtime.subscriptions;
    const listeners = subscriptions[key] || (subscriptions[key] = []);
    listeners.push(listener);

    realtime.update(this.r);

    return () => {
      const listeners = subscriptions[key] || subscriptions[key] || [];
      removeItem(listeners, listener);
      realtime.update(this.r);
    };
  }
}
