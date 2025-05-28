import { ModelBase, ModelCreate, ModelUpdate, ModelUpsert } from "./_models.generated";
import { Req, ReqOptions, ReqParams, createReq } from "../helpers/createReq";
import { Err } from "../helpers/err";
import { parse, stringify } from "../helpers/json";
import pathJoin from "../helpers/pathJoin";
import { removeItem } from "../helpers/array";
import { toVoid } from "../helpers";

export type Keys<T> = { [K in keyof T]: K extends symbol ? never : K }[keyof T];

export type RepoWhere<T extends ModelBase> = {
  [P in keyof T]?: string | number | Date
}

export interface RepoOptions<T extends ModelBase> {
  select?: (Keys<T>)[];
  where?: RepoWhere<T>;
  orderBy?: (Keys<T> | `-${Keys<T>}`)[];
  expand?: string;
  page?: number;
  perPage?: number;
  skipTotal?: boolean;
  headers?: Record<string, string>;
  intervalMs?: number;
  reqOptions?: ReqOptions<T>;
}

export const apiContext = {
  token: '',
  onError: toVoid,
}

export const getParams = (o?: RepoOptions<any>): ReqParams => {
  if (!o) return {};
  
  const { select, where, orderBy, expand, page, perPage, skipTotal } = o;

  const r: ReqParams = {};

  if (orderBy) r.sort = orderBy.join(',');
  if (select) r.fields = select.join(',');
  if (expand) r.expand = expand;
  if (page) r.page = page;
  if (perPage) r.perPage = perPage;
  if (skipTotal) r.skipTotal = 'true';
  if (where) {
    const filters = Object.entries(where||{}).map(([k, v]) => (
      (typeof v === "string" && v.match(/^ *[=<>]/)) ? `${k} ${v}` : `${k} = "${v}"`
    ));
    r.filter = '(' + filters.join(" && ") + ')';
  }

  return r;
}

const pbApiURL = localStorage.getItem('_PB_API_URL') || 'http://127.0.0.1:8090/api';

const initRealtime = () => {
  let clientId: string = "";
  let eventSource: EventSource|undefined = undefined;
  let xhr: XMLHttpRequest|undefined = undefined;
  let intervalId: any;
  let lastState = "";
  const subscriptions: Record<string, ((data: any) => void)[]> = {};
  const realtimeUrl = pathJoin(pbApiURL, 'realtime');

  const isConnected = (): boolean => !!eventSource && !!clientId;
  
  const addAllListeners = (eventSource: EventSource) => {
    console.debug('realtime addAllListeners', eventSource);
    for (const key in subscriptions) {
      const listeners = subscriptions[key];
      for (let listener of listeners) {
        eventSource.addEventListener(key, listener);
      }
    }
  }
  
  const disconnect = () => {
    console.debug('realtime disconnect', !!xhr, !!eventSource, clientId);
    if (xhr) {
      xhr.abort();
      xhr = undefined;
    }
    if (eventSource) {
      eventSource.close();
      eventSource = undefined;
    }
    clientId = "";
  }
  
  const connect = async () => {
    console.debug('realtime connect', { realtimeUrl  });
    await disconnect();
    await new Promise<void>(resolve => {
      eventSource = new EventSource(realtimeUrl);
      eventSource.addEventListener("PB_CONNECT", (e: MessageEvent) => {
        console.debug('PB_CONNECT', e);
        if (!e) return console.warn('PB_CONNECT e');
        const id = (parse(e.data) || {}).clientId;
        if (!id) return console.warn('PB_CONNECT id');
        clientId = id;
        resolve();
      });
    });
    console.debug('realtime connected', { clientId });
  }
  
  const update = async (req: Req) => {
    try {
      console.debug('realtime update');
      clearInterval(intervalId);
      intervalId = setInterval(() => update(req), 10000);

      const state = Object.keys(subscriptions).join(',') + isConnected();
      if (state === lastState) return;
      lastState = state;

      const subscriptionKeys: string[] = [];
      for (const key in subscriptions) {
        if (!subscriptions[key].length) {
          delete subscriptions[key];
        }
        else {
          subscriptionKeys.push(key);
        }
      }
      console.debug('realtime update keys', subscriptionKeys);

      if (!subscriptionKeys.length) return await disconnect();
      if (!isConnected()) await connect();


//         await ky.post(this.getRealtimeUrl(), {
//             json: {
//                 clientId: this.clientId,
//                 subscriptions: this.lastSentSubscriptions,
//             },
//             headers: {
//                 Authorization: this.tokenRef.token,
//             },
//             signal: (this.cancel = new AbortController()).signal
//         });
      await req('POST', realtimeUrl, {
        xhr: true,
        json: {
          clientId,
          subscriptions: subscriptionKeys,
        },
        headers: {
          'content-type': 'application/json',
        },
        before: (ctx) => {
          xhr = ctx.xhr;
        }
      });

      xhr = undefined;
      if (eventSource) addAllListeners(eventSource);
    }
    catch (error) {
      console.error('realtime update', error);
    }
  }

  return {
    subscriptions,
    update,
  }
}

const realtime = initRealtime();

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

let serverTimeOffset = 0;

export class PbRepo<T extends ModelBase> {
  unsubscribes: (() => void)[] = [];
  req: Req;

  constructor(public coll: string) {
    this.req = createReq({
      xhr: true,
      baseUrl: `${pbApiURL}/collections/${this.coll}/`,
      timeout: 10000,
      base: (options) => {
        options.headers = {
          Authorization: apiContext.token,
          ...options.headers,
        }
      },
    });
  }

  now() {
    return new Date();
  }

  // async _get<O = any>(path: string, options: RepoOptions<T> = {}): Promise<O> {
  //   const url = pathJoin(API_URL, path);
  //   console.debug('_get', url, options);
  //   return ky.get(url, getKyOptions(null, options)).json<O>().catch(ApiError.throw);
  // }

  // async _post<O = any, I = any>(path: string, data?: I, options: RepoOptions<T> = {}): Promise<O> {
  //   const url = pathJoin(API_URL, path);
  //   console.debug('_post', url, data, options);
  //   return ky.post(url, getKyOptions(data, options)).json<O>().catch(ApiError.throw);
  // }

  // async req<O = any, I = any>(method: 'GET'|'POST'|'PATCH', path: string, data?: I, options: RepoOptions<T> = {}): Promise<O> {
  //   console.debug('req', this.coll, method, path, data, options);
  //   const url = pathJoin(API_URL, path);
  //   const requestInit = getRequestInit(options);
  //   const response = await fetchWithTimeout(url, requestInit);
  //   const result = await response.json().catch(() => null);
  //   if (!response.ok) ApiError.throw(result);
  //   return result;
  // }

  get(id: string, o?: RepoOptions<T>): Promise<T> {
    if (!id) throw new Err('no id');
    const reqOptions = o?.reqOptions || {};
    return this.req('GET', `records/${id}`, {
      ...reqOptions,
      params: {
        ...getParams(o),
        ...reqOptions.params,
      },
    });
  }

  findPage(where: RepoWhere<T>, o?: RepoOptions<T>) {
    return this.req<{
      items: T[],
      page: number,
      perPage: number,
      totalItems: number,
      totalPages: number,
    }>('GET', `records`, {
      params: getParams({ where, ...o } as RepoOptions<T>),
    });
  }

  find(where: RepoWhere<T>, o?: RepoOptions<T>) {
    return this.findPage(where, { page: 1, perPage: 1000, skipTotal: true, ...o }).then(r => r.items);
  }

  findOne(where: RepoWhere<T>, o?: RepoOptions<T>) {
    return this.findPage(where, { page: 1, perPage: 1, skipTotal: true, ...o }).then(r => r.items[0]);
  }

  count(where: RepoWhere<T>, o?: RepoOptions<T>) {
    return this.findPage(where, { page: 1, perPage: 1, ...o }).then(r => r.totalItems);
  }

  create(item: ModelCreate<T>, o?: RepoOptions<T>): Promise<T> {
    return this.req('POST', `records`, {
      params: getParams(o),
      form: item
    });
  }

  update(id: string, changes: ModelUpdate<T>, o?: RepoOptions<T>): Promise<T> {
    if (!id) throw new Err('no id');
    return this.req('PATCH', `records/${id}`, {
      params: getParams(o),
      form: changes
    });
  }

  upsert(where: RepoWhere<T>, changes: ModelUpsert<T>, o?: RepoOptions<T>) {
    return this.findOne(where, { select: ['id'] as Keys<T>[] })
      .then(item => item ? this.update(item.id, changes, o) : this.create(changes, o));
  }

  setToken(token: string) {
    apiContext.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return apiContext.token;
  }

  login(usernameOrEmail: string, password: string, o?: RepoOptions<T>): Promise<T> {
    return this.req('POST', `auth-with-password`, {
      params: getParams(o),
      form: {
        identity: usernameOrEmail,
        password,
      }
    }).then(result => {
      console.debug('login result', result);
      this.setToken(result.token);
      return result.record;
    });
  }

  logout() {
    this.setToken('');
  }

  async subscribe(topic: string, cb: (item: T, action: 'update'|'create'|'delete') => void, o?: RepoOptions<T>) {
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

    await realtime.update(this.req);

    return async () => {
      const listeners = subscriptions[key] || (subscriptions[key] || []);
      removeItem(listeners, listener);
      await realtime.update(this.req);;
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
