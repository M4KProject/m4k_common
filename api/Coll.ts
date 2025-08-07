// deno-lint-ignore-file no-explicit-any
import { Keys, ModelBase, ModelCreate, ModelUpdate, ModelUpsert } from "./_models.generated";
import { Req, ReqOptions, ReqParams, createReq } from "../helpers/req";
import { Err } from "../helpers/err";
import { parse, stringify } from "../helpers/json";
import { pathJoin } from "../helpers/pathJoin";
import { removeItem } from "../helpers/array";
import { auth$, getApiUrl } from "./messages";
import { realtime } from "./realtime";
import { isArray } from "../helpers/check";

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
  | '?!~' // Any/At least one of NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)

export type CollOperand = string | number | null | boolean | Date;

export type CollFilter = CollOperand | [CollOperator, CollOperand];

export type CollWhere<T extends ModelBase> = { [P in keyof T]?: CollFilter };

export interface CollOptions<T extends ModelBase> {
  select?: (Keys<T>)[];
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
  const [ operator, operand ] = isArray(propFilter) ? propFilter : [ '=', propFilter ];

  const operandString =
    typeof operand === 'string' ? `"${operand}"` :
    operand instanceof Date ? stringify(operand) :
    operand;

  return `${key} ${operator} ${operandString}`;
}

const stringifyWhere = <T extends ModelBase>(where: CollWhere<T>[] | CollWhere<T> | undefined): string|undefined => {
  if (!where) return undefined;
  
  if (isArray(where)) {
    const orList = where.map(stringifyWhere).filter(f => f);
    if (orList.length === 0) return undefined;
    return `(${orList.join(" || ")})`;
  }

  const filters = Object.entries(where||{}).map(([k, f]) => f ? stringifyFilter(k, f) : '').filter(f => f);
  if (filters.length === 0) return undefined;
  
  return `(${filters.join(" && ")})`;
}

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
}

// class Realtime {
//   connected = false;
//   private _sse?: EventSource;
//   private _clientId = '';
//   private _subscriptions: Record<string, (data: any, event: any) => any> = {};
//   private _listeners: Record<string, (this: EventSource, event: MessageEvent) => any> = {};

//   constructor(public url: string) {}

//   connect() {
//     console.debug('Realtime.connect');
//     let sse = this._sse;
//     if (sse) this.disconnect();
    
//     sse = new EventSource(this.url);
//     this._sse = sse;

//     const connectTimeoutId = setTimeout(() => this.connect(), 15000);

//     const on = (key: string, listener: (event: any) => void) => {
//       sse.addEventListener(key, listener);
//     }

//     on('error', (event) => {
//       console.warn("Realtime error", event);
//       this.connected = false;
//       this.connect();
//     });

//     on('message', (event) => {
//       console.info("Realtime message", event);
//     });

//     on('PB_CONNECT', (event) => {
//       this._clientId = JSON.parse(event.data).clientId;
//       console.info("Realtime connect", this._clientId);
//       this.connected = true;
//       clearTimeout(connectTimeoutId);
//       this.submitSubscriptions();
//     });
//   }

//   async submitSubscriptions() {
//     console.debug('Realtime.submitSubscriptions');

//     const sse = this._sse;
//     if (!sse || !this.connected) {
//       this.connect();
//       return;
//     }
    
//     Object.entries(this._subscriptions).forEach(([key, cb]) => {
//       const topic = key.split('?')[0];
//       const coll = topic.split('/')[0];
//       console.info("Realtime.submitSubscriptions addEventListener", coll, topic, key);
//       if (this._listeners[key]) return;
//       this._listeners[key] = (event: any) => {
//         console.debug('Realtime listener', key, event);
//         cb(JSON.parse(event.data), event);
//       };
//       sse.addEventListener(key, this._listeners[key]);
//       sse.addEventListener(topic, this._listeners[key]);
//       sse.addEventListener(coll, this._listeners[key]);
//     });
    
//     const result = await ky.post(this.url, {
//       json: {
//         clientId: this._clientId,
//         subscriptions: Object.keys(this._subscriptions),
//       }
//     }).json().catch(error => {
//       console.error('Realtime.submitSubscriptions error', error);
//     });

//     console.info("Realtime.submitSubscriptions result", result);
//   }

//   // 'devices/8e2mu4rr32b0glf?options={"headers": {"x-token": "..."}}'
//   async subscribe(key: string, cb: (data: any, event: any) => void) {
//     console.debug('Realtime.subscribe', key);
//     this._subscriptions[key] = cb;
//     await this.submitSubscriptions();
//     return () => this.unsubscribe(key);
//   }

//   async unsubscribe(key: string) {
//     const topic = key.split('?')[0];
//     console.debug('Realtime.unsubscribe', topic, key);
//     delete this._subscriptions[key];
//     const sse = this._sse;
//     if (sse) {
//       // sse.removeEventListener(key, this._listeners[key]);
//       sse.removeEventListener(topic, this._listeners[key]);
//       delete this._listeners[key];
//     }
//     await this.submitSubscriptions();
//   }

//   disconnect() {
//     console.debug('Realtime.disconnect');
//     this.connected = false;
//     this._clientId = '';
//     this._listeners = {};
//     const sse = this._sse;
//     if (sse) {
//       delete this._sse;
//       sse.close();
//     }
//   }
// }

export const apiReq = (baseUrl: string) => (
  createReq({
    fetch: true,
    // xhr: false,
    baseUrl: pathJoin(getApiUrl(), baseUrl),
    timeout: 10000,
    base: (options) => {
      const auth = auth$.v;
      if (auth) {
        options.headers = {
          Authorization: auth.token, // `Bearer ${auth.token}`,
          ...options.headers,
        }
      }
    },
  })
);

export class Coll<T extends ModelBase> {
  unsubscribes: (() => void)[] = [];
  r: Req;
  
  constructor(public coll: string) {
    this.r = apiReq(`collections/${this.coll}/`);
  }

  // async _get<O = any>(path: string, options: CollOptions<T> = {}): Promise<O> {
  //   const url = pathJoin(API_URL, path);
  //   console.debug('_get', url, options);
  //   return ky.get(url, getKyOptions(null, options)).json<O>().catch(ApiError.throw);
  // }

  // async _post<O = any, I = any>(path: string, data?: I, options: CollOptions<T> = {}): Promise<O> {
  //   const url = pathJoin(API_URL, path);
  //   console.debug('_post', url, data, options);
  //   return ky.post(url, getKyOptions(data, options)).json<O>().catch(ApiError.throw);
  // }

  // async req<O = any, I = any>(method: 'GET'|'POST'|'PATCH', path: string, data?: I, options: CollOptions<T> = {}): Promise<O> {
  //   console.debug('req', this.coll, method, path, data, options);
  //   const url = pathJoin(API_URL, path);
  //   const requestInit = getRequestInit(options);
  //   const response = await fetchWithTimeout(url, requestInit);
  //   const result = await response.json().catch(() => null);
  //   if (!response.ok) ApiError.throw(result);
  //   return result;
  // }

  log(...args: any[]) {
    console.debug('Coll', this.coll, ...args);
  }

  get(id: string, o?: CollOptions<T>): Promise<T|null> {
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
      items: T[],
      page: number,
      perPage: number,
      totalItems: number,
      totalPages: number,
    }>('GET', `records`, {
      ...reqOptions,
      params: getParams({ where, ...o } as CollOptions<T>),
    });
  }

  find(where: CollWhere<T>, o?: CollOptions<T>) {
    return this.findPage(where, { page: 1, perPage: 1000, skipTotal: true, ...o }).then(r => r.items);
  }

  findOne(where: CollWhere<T>, o?: CollOptions<T>): Promise<T|null> {
    return this.findPage(where, { page: 1, perPage: 1, skipTotal: true, ...o }).then(r => r.items[0]||null);
  }

  findKey(key: string, o?: CollOptions<T>): Promise<T|null> {
    return this.findOne({ key } as CollWhere<T>, { ...o }).then((result) => {
      if (!result) return this.get(key);
      return result;
    });
  }

  count(where: CollWhere<T>, o?: CollOptions<T>) {
    return this.findPage(where, { page: 1, perPage: 1, ...o }).then(r => r.totalItems);
  }

  create(item: ModelCreate<T>, o?: CollOptions<T>): Promise<T> {
    this.log('create', item, o);
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('POST', `records`, {
      ...reqOptions,
      params: getParams(o),
      form: item
    });
  }
  
  update(id: string|CollWhere<T>, changes: ModelUpdate<T>, o?: CollOptions<T>): Promise<T|null> {
    this.log('update', id, changes, o);
    if (!id) throw new Err('no id');
    if (typeof id === 'object') {
      return this.findOne(id, { ...o, select: ['id' as Keys<T>] }).then(item => {
        if (!item) return null;
        return this.update(item.id, changes, o);
      });
    }
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('PATCH', `records/${id}`, {
      ...reqOptions,
      params: getParams(o),
      form: changes
    });
  }

  delete(id: string, o?: CollOptions<T>): Promise<void> {
    this.log('delete', id, o);
    if (!id) throw new Err('no id');
    const reqOptions: ReqOptions = o?.req || {};
    return this.r('DELETE', `records/${id}`, {
      ...reqOptions,
      params: getParams(o),
      responseType: 'text',
    });
  }

  upsert(where: CollWhere<T>, changes: ModelUpsert<T>, o?: CollOptions<T>) {
    this.log('upsert', where, changes, o);
    return this.findOne(where, { select: ['id'] as Keys<T>[] })
      .then(item => item ? this.update(item.id, changes, o) as Promise<T> : this.create(changes, o));
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

  async subscribe(topic: string, cb: (item: T, action: 'update'|'create'|'delete') => void, o?: CollOptions<T>) {
    console.debug('subscribe', this.coll, topic, o);
    // 'devices/8e2mu4rr32b0glf?options={"headers": {"x-token": "..."}}'

    const p = getParams(o);
    const keyOptions = encodeURIComponent(stringify({
      query: p.query,
      headers: p.headers,
    }));
    let key = `${this.coll}/${topic}`;
    if (p.query || p.headers) key += `?options=${keyOptions}`;

    console.debug('subscribe key', this.coll, key);

    const listener = (event: MessageEvent) => {
      console.debug('subscribe listener', this.coll, key, event);
      const payload = parse(event.data);
      console.debug('subscribe listener payload', this.coll, key, payload);
      cb(payload.record, payload.action);
    };
    
    const subscriptions = realtime.subscriptions;
    const listeners = subscriptions[key] || (subscriptions[key] = []);
    listeners.push(listener);

    await realtime.update(this.r);

    return async () => {
      const listeners = subscriptions[key] || (subscriptions[key] || []);
      removeItem(listeners, listener);
      await realtime.update(this.r);
    };

    
    // let updated: Date | string = '';

    // const timer = setInterval(async () => {
    //   try {
    //     const updatedItem = await this.get(id, { select: ['updated' as Keys<T>] });
    //     if (updatedItem.updated === updated) return;
    //     updated = updatedItem.updated;
    //     const item = await this.get(id, o);
    //     cb(item);
    //   }
    //   catch (error) {
    //     console.warn('onUpdated', id, error);
    //     updated = '';
    //   }
    // }, o?.intervalMs || 10000);

    // const unsubscribe = () => {
    //   clearInterval(timer);
    // }

    // this.unsubscribes.push(unsubscribe);

    // return () => {
    //   const index = this.unsubscribes.indexOf(unsubscribe);
    //   if (index !== -1) this.unsubscribes.splice(index, 1);
    //   unsubscribe();
    // };
  }

  // unsubscribe() {
  //   for (const unsubscribe of this.unsubscribes) {
  //     try {
  //       unsubscribe();
  //     }
  //     catch (e) {}
  //   }
  //   this.unsubscribes = [];
  // }

  // findOne(where: FindOptions<T>["where"], options?: FindOptions<T>) {
  //   return this.findOne(toFindOptions({ ...options, where }));
  // }

  // async findPage(options: FindOptions<T>) {
  //   console.debug("find", options);
  //   const o = toFindOptions(options);
  //   const result = await this.coll.getList(o.page || 1, o.perPage || 10, o);
  //   console.debug("find result", o, result);
  //   return result;
  // }

  // async find(options: FindOptions<T>) {
  //   console.debug("findAll", options);
  //   const result = await this.findPage({
  //     page: 1,
  //     perPage: 9999,
  //     ...options,
  //   });
  //   return result.items;
  // }

  // async findOne(options: FindOptions<T>) {
  //   console.debug("findOne", options);
  //   const result = await this.findPage({
  //     page: 1,
  //     perPage: 1,
  //     ...options,
  //   });
  //   return result.items[0];
  // }

  // async subscribe(
  //   topic: string,
  //   cb: (data: RecordSubscription<T>) => void,
  //   options?: SendOptions
  // ) {
  //   const unsubscribe = await this.coll.subscribe(
  //     topic,
  //     (data) => {
  //       try {
  //         cb(data);
  //       } catch (error) {
  //         console.error("subscribe", topic, data);
  //       }
  //     },
  //     options
  //   );
  //   this.unsubscribes.push(unsubscribe);
  //   return () => {
  //     const index = this.unsubscribes.indexOf(unsubscribe);
  //     if (index !== -1) this.unsubscribes.splice(index, 1);
  //     return unsubscribe();
  //   };
  // }

  // async unsubscribe() {
  //   const unsubscribes = this.unsubscribes;
  //   this.unsubscribes = [];
  //   for (const unsubscribe of unsubscribes) {
  //     await unsubscribe();
  //   }
  // }
}


// function toFindOptions<T extends ModelBase>(
//   options?: FindOptions<T>
// ): RecordListOptions {
//   if (!options) return {};
//   const { select, where, orderBy, ...o } = options;
//   if (where) {
//     const filters = Object.entries(where).map(([k, v]) => {
//       if (typeof v === "string") {
//         if (v.match(/^ *[=<>]/)) return `${k} ${v}`;
//       }
//       return `${k} = "${v}"`;
//     });
//     if (o.filter) filters.push(o.filter);
//     o.filter = filters.join(" && ");
//   }
//   if (select) {
//     o.fields = (o.fields ? [o.fields, ...select] : select).join(",");
//   }
//   if (orderBy) {
//     o.sort = (o.sort ? [o.sort, ...orderBy] : orderBy).join(",");
//   }
//   console.debug("toListOptions", options, o);
//   return o;
// }
