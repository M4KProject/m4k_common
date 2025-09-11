// deno-lint-ignore-file no-explicit-any
import { Keys, ModelBase, ModelCreate, ModelUpdate, ModelUpsert } from './models';
import {
  Err,
  Req,
  ReqOptions,
  ReqParams,
  createReq,
  parse,
  stringify,
  pathJoin,
  removeItem,
  isList,
  isDef,
} from '../helpers';
import { auth$, getApiUrl } from './messages';
import { realtime } from './realtime';

export type CollOperator =
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

export type CollOperand = string | number | null | boolean | Date;

export type CollFilter = CollOperand | [CollOperator, CollOperand];

export type CollWhere<T extends ModelBase> = { [P in keyof T]?: CollFilter };

export interface CollOptions<T extends ModelBase> {
  select?: Keys<T>[];
  where?: CollWhere<T>;
  orderBy?: (Keys<T> | `-${Keys<T>}`)[];
  expand?: string;
  page?: number;
  perPage?: number;
  skipTotal?: boolean;
  headers?: Record<string, string>;
  intervalMs?: number;
  req?: ReqOptions<T>;
}

const stringifyFilter = (key: string, propFilter: CollFilter) => {
  const [operator, operand] = isList(propFilter) ? propFilter : ['=', propFilter];

  const operandString =
    typeof operand === 'string'
      ? `"${operand}"`
      : operand instanceof Date
        ? stringify(operand)
        : operand;

  return `${key} ${operator} ${operandString}`;
};

const stringifyWhere = <T extends ModelBase>(
  where: CollWhere<T>[] | CollWhere<T> | undefined
): string | undefined => {
  if (!where) return undefined;

  if (isList(where)) {
    const orList = where.map(stringifyWhere).filter((f) => f);
    if (orList.length === 0) return undefined;
    return `(${orList.join(' || ')})`;
  }

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

export const apiReq = (baseUrl: string) =>
  createReq({
    baseUrl: pathJoin(getApiUrl(), baseUrl),
    timeout: 10000,
    // log: true,
    base: (options) => {
      const auth = auth$.v;
      if (auth) {
        options.headers = {
          Authorization: `Bearer ${auth.token}`,
          'X-Auth-Token': auth.token, // For Android WebView
          ...options.headers,
        };
      }
    },
  });

export class Coll<T extends ModelBase> {
  unsubscribes: (() => void)[] = [];
  r: Req;

  constructor(public coll: string) {
    this.r = apiReq(`collections/${this.coll}/`);
  }

  log(...args: any[]) {
    console.debug('Coll', this.coll, ...args);
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

  findPage(where: CollWhere<T>, o?: CollOptions<T>) {
    // this.log('findPage', where, o);
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

  find(where: CollWhere<T>, o?: CollOptions<T>) {
    return this.findPage(where, { page: 1, perPage: 1000, skipTotal: true, ...o }).then(
      (r) => r.items
    );
  }

  findOne(where: CollWhere<T>, o?: CollOptions<T>): Promise<T | null> {
    return this.findPage(where, { page: 1, perPage: 1, skipTotal: true, ...o }).then(
      (r) => r.items[0] || null
    );
  }

  findId(where: CollWhere<T>, o?: CollOptions<T>): Promise<string | null> {
    return this.findOne(where, { ...o, select: ['id' as Keys<T>] }).then(r => r?.id);
  }

  findKey(key: string, o?: CollOptions<T>): Promise<T | null> {
    return this.findOne({ key } as CollWhere<T>, { ...o }).then((result) => {
      if (!result) return this.get(key);
      return result;
    });
  }

  count(where: CollWhere<T>, o?: CollOptions<T>) {
    return this.findPage(where, { page: 1, perPage: 1, ...o }).then((r) => r.totalItems);
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

  update(
    id: string | CollWhere<T>,
    changes: ModelUpdate<T>,
    o?: CollOptions<T>
  ): Promise<T | null> {
    this.log('update', id, changes, o);
    if (!id) throw new Err('no id');
    if (typeof id === 'object') {
      return this.findId(id, o).then(id => (
        id ? this.update(id, changes, o) : null
      ));
    }
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('PATCH', `records/${id}`, {
      ...reqOptions,
      params: getParams(o),
      form: changes,
    });
  }

  up(id: string | CollWhere<T>, changes: ModelUpdate<T>, o?: CollOptions<T>) {
    return this.update(id, changes, { ...o, select: [] }).then(Boolean);
  }

  delete(id: string, o?: CollOptions<T>): Promise<void> {
    this.log('delete', id, o);
    if (!id) throw new Err('no id');
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('DELETE', `records/${id}`, {
      ...reqOptions,
      params: getParams(o),
      resType: 'text',
    });
  }

  upsert(where: CollWhere<T>, changes: ModelUpsert<T>, o?: CollOptions<T>) {
    this.log('upsert', where, changes, o);
    return this.findId(where).then(id => (
      id ? (this.update(id, changes, o) as Promise<T>) : this.create(changes, o)
    ));
  }

  getUrl(id?: string, filename?: any) {
    if (!id || !filename) return '';
    return pathJoin(getApiUrl(), `files/${this.coll}/${id}/${filename}`);
  }

  getThumbUrl(id?: string, filename?: any, thumb?: [number, number]) {
    if (!id || !filename) return '';
    const url = this.getUrl(id, filename);
    const [w, h] = thumb || [200, 200];
    return `${url}?thumb=${w}x${h}`;
  }

  async subscribe(
    topic: string,
    cb: (item: T, action: 'update' | 'create' | 'delete') => void,
    o?: CollOptions<T>
  ) {
    console.debug('subscribe', this.coll, topic, o);
    // 'devices/8e2mu4rr32b0glf?options={"headers": {"x-token": "..."}}'

    const p = getParams(o);
    const keyOptions = encodeURIComponent(
      stringify({
        query: p.query,
        headers: p.headers,
      })
    );
    let key = `${this.coll}/${topic}`;
    if (p.query || p.headers) key += `?options=${keyOptions}`;

    console.debug('subscribe key', this.coll, key);

    const listener = (event: MessageEvent) => {
      // console.debug('subscribe listener', this.coll, key, event);
      const payload = parse(event.data);
      const record = (payload ? payload.record : null) || payload;
      const id = (record ? record.id : null) || record;
      console.debug('subscribe listener payload', this.coll, key, id);
      cb(record, payload.action);
    };

    const subscriptions = realtime.subscriptions;
    const listeners = subscriptions[key] || (subscriptions[key] = []);
    listeners.push(listener);

    await realtime.update(this.r);

    return async () => {
      const listeners = subscriptions[key] || subscriptions[key] || [];
      removeItem(listeners, listener);
      await realtime.update(this.r);
    };
  }
}
