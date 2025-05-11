import { Msg } from './Msg'

const PLUS_EXP = /\+/g;
const queryDecode = (s: string) => decodeURIComponent(s.replace(PLUS_EXP, ' '));

export type RouterHandler = (route: RouterValue) => any;

export type RouterParams = Record<string, string>;

export type RouterNode = {
  children?: { [part: string]: RouterNode };
  prop?: string;
  match?: string;
  handler?: RouterHandler | null;
  params?: RouterParams;
};

export type RouterValue = RouterNode & {
  host: string;
  path: string;
  params: RouterParams;
};

const root: RouterNode = {};

const updated$ = new Msg<RouterValue>({ host: '', path: '', params: {} });

const add = (match: string, handler?: RouterHandler | null, params?: RouterParams) => {
  // console.debug('router.add', match, params);
  const parts = match.split('/');
  if (parts[0] === '') parts.splice(0, 1);
  let node = root;
  for (const part of parts) {
    const children = node.children || (node.children = {});
    if (part[0] === ':') {
      node = children[':'] || (children[':'] = {});
      node.prop = part.substring(1);
      continue;
    }
    node = children[part] || (children[part] = {});
  }
  node.match = match;
  node.handler = handler;
  node.params = params;
};

const resolve = (path: string): RouterValue => {
  let host = location.host;

  const queryIndex = path.indexOf('?');
  const query = queryIndex === -1 ? '' : path.substring(queryIndex + 1);
  const pathWithoutQuery = queryIndex === -1 ? path : path.substring(0, queryIndex);
  const parts = pathWithoutQuery.split('/');
  let node = root;
  let params: Record<string, string> = {};

  if (parts[0] && parts[0].endsWith(':') && parts[1] === '') {
    host = parts[2];
    parts.splice(0, 3);
  }
  if (parts[0] === '') parts.splice(0, 1);

  parts.forEach((part) => {
    const children = node.children;
    if (!children) return;
    const next = children[part] || children[':'];
    if (!next) return;
    if (next.prop) params[next.prop] = part;
    node = next;
  });

  if (node.params) params = { ...node.params, ...params };

  if (query) {
    query.split('&').forEach((part) => {
      const equalIndex = part.indexOf('=');
      const k = queryDecode(equalIndex === -1 ? part : part.substring(0, equalIndex));
      const v = queryDecode(equalIndex === -1 ? 'true' : part.substring(equalIndex + 1));
      const v0 = params[k];
      if (v0 === undefined) params[k] = v;
      else params[k] = v0 + '&' + v;
    });
  }

  const result: RouterValue = { ...node, host, path, params };
  // console.debug('router.resolve', result);
  return result;
};

let _lastResult: any = null;
const forceRefresh = async () => {
  // console.debug('router.forceRefresh');
  const val = resolve(location.href);
  updated$.set(val);
  const h = val.handler;
  if (h) {
    const result = await h(val);
    console.debug('result', result);
    if (_lastResult === result) return;
    (_lastResult?.unmount||(() => {}))();
    _lastResult = result;
    (result?.mount||(() => {}))();
  }
};

const refresh = (_event?: Event | string) => {
  // const type = event ? (typeof event === 'string' ? event : event.type) : '';
  // console.debug('router.refresh', type, location.href);
  if (updated$.v.path === location.href) return;
  forceRefresh();
};

const push = (route: string | URL) => {
  console.debug('router.push', route);
  history.pushState({}, '', route);
  forceRefresh();
};

const back = () => {
  console.debug('router.back');
  history.back();
  forceRefresh();
};

const idToKey = (id: number | string | undefined | null, title?: string | null) => {
  console.debug('router.idToKey', id, title);
  const a = String(id === null || id === undefined ? '' : id);
  const b = title
    ? '__' +
      String(title)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
    : '';
  return a + b;
};

const keyToId = (key?: string | null) => {
  console.debug('router.keyToId', key);
  return String(key || '').split('__')[0] || '';
};

window.addEventListener('locationchange', refresh);
window.addEventListener('hashchange', refresh);
window.addEventListener('popstate', refresh);
setInterval(refresh, 2000);

const _history = (type: string) => {
  const fun = (history as any)[type];
  (history as any)[type] = function () {
    const r = fun.apply(history, arguments);
    refresh('history_' + type);
    return r;
  };
};

_history('pushState');
_history('replaceState');
_history('back');

export const router = {
  updated$,
  current: updated$.v,
  root,
  add,
  resolve,
  push,
  back,
  refresh,
  forceRefresh,
  idToKey,
  keyToId,
};

updated$.on((val) => (router.current = val));

forceRefresh();

export default router;

// const router$ = messager({
//     mode: null,
//     root: '/',
// });

// const clearSlashes = (path: string) => path.toString().replace(/\/$/, '').replace(/^\//, '');

// config: (options) => {
//     this.mode = options && options.mode && options.mode == 'history'
//                 && !!(history.pushState) ? 'history' : 'hash';
//     this.root = options && options.root ? '/' + clearSlashes(options.root) + '/' : '/';
//     return this;
// }

// getFragment: function() {
//     var fragment = '';
//     if(this.mode === 'history') {
//         fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
//         fragment = fragment.replace(/\\?(.*)$/, '');
//         fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
//     } else {
//         var match = window.location.href.match(/#(.*)$/);
//         fragment = match ? match[1] : '';
//     }
//     return this.clearSlashes(fragment);
// }

// const removeRoute = (param) {
//     for(let i=0, l=routes.length; i<l; i++) {
//         const r = routes[i];
//         if(r.handler === param || r.re.toString() === param.toString()) {
//             this.routes.splice(i, 1);
//             return this;
//         }
//     }
//     return this;
// }
