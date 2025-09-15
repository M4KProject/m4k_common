import { isBetween, isDate, isDef, isFileOrBlob, isList, isObj, isStr } from './check';
import { parse, stringify } from './json';
import { pathJoin } from './pathJoin';

export type FormDataObject = { [prop: string]: any };
export type ReqURL = string | URL;
export type ReqMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
export type ReqParams = Record<string, undefined | string | number | (string | number)[]>;
export type ReqData = any;
export type ReqHeaders = Record<string, string>;
export type ReqBody = Document | XMLHttpRequestBodyInit | File | null | undefined;
export type ReqResponseType = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';

export class ReqError<T = any> extends Error {
  status: number;
  res?: Response;
  data?: T;
  constructor(
    message: string,
    public ctx: Partial<ReqContext<T>>
  ) {
    super(message);
    this.status = ctx.status || 0;
    this.res = ctx.res;
    this.data = ctx.data;
  }
}

export interface ReqOptions<T = any> {
  url?: ReqURL;
  method?: ReqMethod | null;
  headers?: ReqHeaders;
  baseUrl?: string | null;
  timeout?: number | null;
  params?: ReqParams | null;
  // data?: ReqData | null;
  body?: ReqBody | null;
  json?: ReqData;
  form?: FormDataObject | FormData | null;
  resType?: ReqResponseType | null;
  noCache?: boolean | null;
  xhr?: boolean | XMLHttpRequest | null;
  fetch?: boolean | ((input: URL, init?: RequestInit) => Promise<Response>) | null;
  base?: (options: ReqOptions<T>) => void | Promise<void> | null;
  before?: (ctx: ReqContext<T>) => void | Promise<void> | null;
  after?: (ctx: ReqContext<T>) => void | Promise<void> | null;
  cast?: (ctx: ReqContext<T>) => T | Promise<T> | null;
  onProgress?: (progress: number, ctx: ReqContext<T>) => void | null;
  request?: <T>(ctx: ReqContext<T>) => Promise<T> | null;
  cors?: boolean | null;
  password?: string | null;
  username?: string | null;
  log?: boolean;
}

export interface ReqContext<T = any> {
  options: ReqOptions<T>;
  url: URL;
  method: ReqMethod;
  resType: ReqResponseType;
  params: ReqParams;
  headers: ReqHeaders;
  body: ReqBody;
  timeout?: number;
  event?: any;
  status?: number;
  ok: boolean;
  data?: T | null;
  error?: any;
  xhr?: XMLHttpRequest;
  res?: Response;
  fetchInit?: RequestInit;
}

const acceptJson = 'application/json';
const acceptMap: Partial<Record<ReqResponseType, string>> = {
  json: acceptJson,
  text: 'text/*; charset=utf-8',
  blob: '*/*',
  document: 'text/html, application/xhtml+xml, application/xml; q=0.9; charset=utf-8',
  arraybuffer: '*/*',
};

export const toFormData = (form: FormDataObject | FormData | null | undefined, base?: FormData) => {
  if (!form) return;
  if (form instanceof FormData) return form;
  const r = base || new FormData();
  for (const k in form) {
    let v = form[k];
    if (isObj(v)) {
      if (isList(v)) {
        for (const child of v) r.append(k, child);
        v = undefined;
      } else if (isFileOrBlob(v)) {
      } else if (isDate(v)) v = v.toISOString();
      else v = stringify(v);
    }
    if (isDef(v)) r.append(k, v);
  }
  return r;
};

export const reqXHR = async <T = any>(ctx: ReqContext<T>): Promise<void> => {
  try {
    const o = ctx.options;
    const log = o.log;
    if (log) console.debug('reqXHR options', o);
    const xhr: XMLHttpRequest = ctx.xhr || (ctx.xhr = new XMLHttpRequest());

    xhr.timeout = ctx.timeout || 20000;
    const responseType = (xhr.responseType = ctx.resType || 'json');

    if (o.cors) xhr.withCredentials = true;

    xhr.open(ctx.method, ctx.url, true, o.username, o.password);

    if (o.cors) xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    for (const key in ctx.headers) {
      const val = ctx.headers[key];
      xhr.setRequestHeader(key, val);
    }

    const onProgress = o.onProgress;
    if (onProgress) {
      const _onProgress = (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
        try {
          if (log) console.debug('reqXHR onProgress', event.loaded, event.total);
          ctx.event = event;
          onProgress(event.loaded / event.total, ctx);
        } catch (error) {
          if (log) console.warn('reqXHR onProgress', event, error);
        }
      };
      xhr.addEventListener('progress', _onProgress);
      xhr.upload?.addEventListener('progress', _onProgress);
    }

    if (o.before) await o.before(ctx);
    await new Promise<void>((resolve) => {
      const cb = () => {
        let data = xhr.response as any;
        if (responseType === 'text') data = String(data);
        else if (responseType === 'json')
          data = typeof data === 'string' ? parse(data) || data : data;
        ctx.data = data;
        ctx.res = xhr.response;
        ctx.status = xhr.status;
        ctx.headers = {};
        resolve();
      };
      xhr.onloadend = xhr.onerror = xhr.ontimeout = xhr.onabort = cb;
      xhr.send(ctx.body);
    });
  } catch (error) {
    ctx.error = error;
    ctx.ok = false;
  }
};

export const reqFetch = async <T = any>(ctx: ReqContext<T>): Promise<void> => {
  try {
    const o = ctx.options;
    const log = o.log;
    const fetchRequest: RequestInit = (ctx.fetchInit = {
      body: ctx.body as any,
      headers: ctx.headers,
      method: ctx.method,
    });

    if (ctx.timeout) {
      if (!AbortSignal.timeout) {
        AbortSignal.timeout = function (milliseconds: number): AbortSignal {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), milliseconds);
          return controller.signal;
        };
      }
      fetchRequest.signal = AbortSignal.timeout(ctx.timeout);
    }

    if (o.before) await o.before(ctx);

    if (log) console.debug('fetch', ctx.url, fetchRequest);

    const response = await (typeof o.fetch === 'function' ? o.fetch : fetch)(ctx.url, fetchRequest);
    ctx.res = response;
    ctx.status = response.status;
    ctx.ok = response.ok;

    if (o.cast) {
      ctx.data = await o.cast(ctx);
      return;
    } else {
      switch (ctx.resType) {
        case 'blob':
          ctx.data = (await response.blob()) as T;
          break;
        case 'json': {
          // Handle 204 No Content responses that have no body to parse
          if (response.status === 204) {
            ctx.data = null as T;
          } else {
            const obj: any = (await response.json()) as any;
            ctx.data = typeof obj === 'string' ? parse(obj) || obj : obj;
          }
          break;
        }
        case 'text':
          ctx.data = (await response.text()) as T;
          break;
        case 'arraybuffer':
          ctx.data = (await response.arrayBuffer()) as T;
          break;
      }
    }
  } catch (error) {
    ctx.error = error;
    ctx.ok = false;
  }
};

const _req = async <T>(options?: ReqOptions<T>): Promise<T> => {
  const o = { ...options };
  const log = o.log === true;

  if (o.base) o.base(o);
  if (!o.url) throw new ReqError<T>('no-url', { options });

  const headers: ReqHeaders = {};
  const params = o.params || {};
  const resType = o.resType || 'json';
  const json = o.json;
  const baseUrl = o.baseUrl || location.protocol + '//' + location.host;

  const url = (() => {
    const oUrl = o.url;
    if (typeof oUrl === 'string') {
      if (oUrl.match(/^https?:\/\//)) return new URL(oUrl);
      return new URL(pathJoin(baseUrl, oUrl));
    }
    return oUrl;
  })();

  const method = (o.method || 'GET').toUpperCase();
  const timeout = o.timeout;
  const formData = toFormData(o.form);

  if (o.noCache) {
    headers['Cache-Control'] = 'no-cache, no-store, max-age=0';
    headers.Expires = 'Thu, 1 Jan 1970 00:00:00 GMT';
    headers.Pragma = 'no-cache';
    params.noCache = Date.now();
  }

  headers.Accept = acceptMap[resType] || acceptJson;

  const body =
    o.body || (json ? (formData ? toFormData(json, formData) : stringify(json)) : formData);

  if (json) headers['Content-Type'] = 'application/json';

  const oHeaders = o.headers;
  if (oHeaders) Object.assign(headers, oHeaders);

  for (const key in params) {
    const v = params[key];
    url.searchParams.set(key, typeof v === 'string' ? v : stringify(v));
  }

  const ctx = {
    options: o,
    url,
    method,
    resType,
    params,
    headers,
    body,
    timeout,
    ok: false,
  } as ReqContext<T>;

  try {
    const request = o.request || (o.fetch || typeof fetch === 'function' ? reqFetch : reqXHR);
    if (log) console.debug('req url', o.url);
    await request(ctx as any);
    if (log) console.debug('req result', o.url, ctx);
    if (o.cast) ctx.data = await o.cast(ctx);
    if (o.after) await o.after(ctx);
    if (log) console.debug('req data', o.url, ctx.data);
  } catch (error) {
    if (log) console.debug('req error', o.url, error);
    ctx.error = error;
  }

  if (!isBetween(ctx.status, 200, 299)) {
    ctx.error = String(ctx.status);
  }

  const error = ctx.error;
  if (error || !ctx.ok) {
    const message = isStr(ctx.error) ? ctx.error : ctx.error.message;
    if (log) console.warn('req error', message, ctx);
    throw new ReqError<T>(message, ctx);
  }

  return ctx.data as T;
};

export interface Req {
  <T = any>(method: ReqMethod, url: string, options?: ReqOptions<T>): Promise<T>;
  <T = any>(options: ReqOptions<T>): Promise<T>;
}

export const createReq =
  (baseOptions: ReqOptions): Req =>
  <T = any>(
    optionsOrMethod: ReqMethod | ReqOptions<T> | null,
    url?: string | null,
    options?: ReqOptions<T>
  ): Promise<T> =>
    _req<T>(
      optionsOrMethod && typeof optionsOrMethod === 'object'
        ? ({
            ...baseOptions,
            ...optionsOrMethod,
          } as any)
        : ({
            ...baseOptions,
            method: optionsOrMethod,
            url: url!,
            ...options,
          } as any)
    );

export const req = createReq({});
