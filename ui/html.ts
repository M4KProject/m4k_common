import { JSX } from 'preact';
import { isEq, isItem, isList, isNbr, isStr, isUndef } from '@common/utils/check';

export type Style = Partial<CSSStyleDeclaration>;

export type HTMLAllElement = HTMLDivElement &
  HTMLInputElement &
  HTMLVideoElement &
  HTMLImageElement &
  HTMLHeadingElement;

export type Drag = {
  e?: DragEvent;
  el: HTMLElement;
  x0: number;
  y0: number;
  x: number;
  y: number;
  dX0: number;
  dY0: number;
  dX: number;
  dY: number;
  dispose: () => void;
};

export const createEl: typeof document.createElement = (tagName, options) =>
  document.createElement(tagName, options);

const _cssFiles: Record<string, HTMLLinkElement> = {};
export const addCssFile = (url: string): HTMLLinkElement => {
  if (_cssFiles[url]) return _cssFiles[url];
  const el = createEl('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = url;
  _cssFiles[url] = document.head.appendChild(el);
  return el;
};

const _jsFiles: Record<string, HTMLScriptElement> = {};
export const addJsFile = (url: string): HTMLScriptElement => {
  if (_jsFiles[url]) return _jsFiles[url];
  const el = createEl('script');
  el.type = 'text/javascript';
  el.async = true;
  el.src = url;
  _jsFiles[url] = document.head.appendChild(el);
  return el;
};

export const waitScriptLoaded = (el: HTMLScriptElement): Promise<HTMLScriptElement> => {
  if ((el as any)._loaded) return (el as any)._loaded;

  (el as any)._loaded = new Promise<HTMLScriptElement>((resolve, reject) => {
    const state = (el as any).readyState;
    if (state === 'complete' || state === 'loaded') {
      resolve(el);
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error(`Loading script ${el.src} timed out after 60s`));
    }, 60000);

    el.addEventListener(
      'load',
      () => {
        clearTimeout(timer);
        resolve(el);
      },
      { once: true }
    );

    el.addEventListener(
      'error',
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
      { once: true }
    );
  });

  return (el as any)._loaded;
};

export const addJsFileAsync = (url: string) => waitScriptLoaded(addJsFile(url));

export const addListener = <
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  element: T | 0,
  type: K,
  listener: (this: T, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): (() => void) => {
  const el = element === 0 ? document.body : element;
  const handler = listener as (this: HTMLElement, ev: HTMLElementEventMap[K]) => any;
  el.addEventListener(type, handler, options);
  return () => el.removeEventListener(type, handler, options);
};

export const addListeners = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement | 0,
  listeners: Record<K, (this: HTMLElement, ev: HTMLElementEventMap[K]) => any>,
  optionsMap?: Record<K, boolean | AddEventListenerOptions>
): (() => void) => {
  const el = element === 0 ? document.body : element;
  for (const type in listeners) {
    el.addEventListener(type, listeners[type], optionsMap ? optionsMap[type] : undefined);
  }
  return () => {
    for (const type in listeners) {
      el.removeEventListener(type, listeners[type]);
    }
  };
};

export const autoScrollEnd = (el?: HTMLElement | null) => {
  if (!el) return;
  let lastUserScroll = 0;
  let isAutoScrolling = false;
  const timer = setInterval(() => {
    const isUserScroll = lastUserScroll + 5000 > Date.now();
    const scrollTopMax = el.scrollHeight - el.clientHeight;
    const isAtBottom = Math.abs(el.scrollTop - scrollTopMax) < 2;
    if (isUserScroll || isAtBottom) {
      isAutoScrolling = false;
      return;
    }
    isAutoScrolling = true;
    el.scrollTop = scrollTopMax;
    el.scrollLeft = 0;
  }, 200);
  const unsubscribe = addListener(el, 'scroll', () => {
    if (isAutoScrolling) return;
    const scrollTopMax = el.scrollHeight - el.clientHeight;
    const isAtBottom = Math.abs(el.scrollTop - scrollTopMax) < 5;
    lastUserScroll = isAtBottom ? 0 : Date.now();
  });
  return () => {
    clearInterval(timer);
    unsubscribe();
  };
};

export interface EventXY {
  x: number;
  y: number;
}

export const eventStop = (e: any) => {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
};

export const eventXY = (ev: MouseEvent | TouchEvent | Touch): EventXY => {
  const e = ev instanceof TouchEvent ? ev.touches[0] : ev;
  return e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 };
};

export const getAttrs = (el: Element) =>
  Object.fromEntries(el.getAttributeNames().map((name) => [name, el.getAttribute(name)]));

export const setAttrs = (el: Element, attrs: Record<string, any>, update?: boolean) => {
  if (!update) for (const a of Array.from(el.attributes)) el.removeAttribute(a.name);
  for (const n in attrs) el.setAttribute(n, attrs[n]);
};

export type Cls = Record<string, boolean | number | undefined | null>;

export const getCls = (el: Element): Cls =>
  Object.fromEntries(el.className.split(' ').map((k) => [k, true]));

export const setCls = (el: Element, cls: Cls | string, replace?: boolean) => {
  if (typeof cls === 'string') {
    el.className = cls;
    return;
  }
  if (replace) el.className = '';
  const list = el.classList;
  for (const name in cls) {
    const isAdd = cls[name];
    isAdd ? list.add(name) : list.remove(name);
  }
};

export const clsx = (...classNames: any[]) => {
  const sb: string[] = [];
  for (const c of classNames) {
    if (c) {
      if (typeof c === 'string') sb.push(c);
      else if (isList(c)) {
        const cls = clsx(...c);
        if (cls) sb.push(cls);
      }
    }
  }
  return sb.join(' ') || undefined;
};

let _colors: Record<string, string> = {};

type CssTransform =
  | string
  | {
      rotate?: string | number; // 0deg
      scale?: string | number;
      translateX?: string | number;
      translateY?: string | number;
    };

type AnimValue =
  | string
  | {
      name?: string;
      count?: JSX.CSSProperties['animationIterationCount'];
      timing?: JSX.CSSProperties['animationTimingFunction'];
      duration?: JSX.CSSProperties['animationDuration'];
      keyframes?: Record<'from' | 'to' | string, { transform: CssTransform }>;
    };

interface CssContext {
  key: string;
  css: Record<string, CssRecord>;
  t?: string[];
  a?: string[];
}

const transformToCss = (transform: CssTransform) => {
  if (typeof transform === 'string') return transform;
  const { rotate: r, scale: s, translateX: x, translateY: y } = transform;
  let css = '';
  if (r) css += `rotate(${isNbr(r) ? `${r}deg` : r});`;
  if (s) css += `scale(${s});`;
  if (x) css += `translateX(${isNbr(x) ? `${x}%` : x});`;
  if (y) css += `translateY(${isNbr(y) ? `${y}%` : y});`;
  return css;
};

let animId = 0;

const animToCss = (value: AnimValue, ctx: CssContext) => {
  if (typeof value === 'string') return `animation:${value};`;
  const { keyframes, duration, count, timing } = value;
  let { name } = value;
  if (!name) name = `m4kAnim${animId++}`;
  const sb = ctx.a || (ctx.a = []);
  sb.push(`@keyframes ${name} {`);
  for (const key in keyframes) {
    const { transform } = keyframes[key];
    sb.push(`  ${key} { transform: ${transformToCss(transform)}; }`);
  }
  sb.push(`}`);
  let css = `animation-name:${name};`;
  if (duration) css += `animation-duration:${duration};`;
  if (count) css += `animation-iteration-count:${count};`;
  if (timing) css += `animation-timing-function:${timing};`;
  return css;
};

const transformProp = (prop: string) => (value: number | string, ctx: CssContext) => {
  const sb = ctx.t || (ctx.t = []);
  sb.push(`${prop}(${value})`);
  return '';
};

const l = (v: Em) => `left:${em(v)};`;
const t = (v: Em) => `top:${em(v)};`;
const r = (v: Em) => `right:${em(v)};`;
const b = (v: Em) => `bottom:${em(v)};`;

const inset = (v: Em) => t(v) + r(v) + b(v) + l(v);

const x = l;
const y = t;
const xy = (v: Em) => x(v) + y(v);

const w = (v: Em) => `width:${em(v)};`;
const h = (v: Em) => `height:${em(v)};`;
const wh = (v: Em) => w(v) + h(v);

const wMax = (v: Em) => `max-${w(v)};`;
const hMax = (v: Em) => `max-${h(v)};`;
const whMax = (v: Em) => wMax(v) + hMax(v);

const wMin = (v: Em) => `min-${w(v)};`;
const hMin = (v: Em) => `min-${h(v)};`;
const whMin = (v: Em) => wMin(v) + hMin(v);

const fontSize = (v: Em) => `font-size:${em(v)};`;

const m = (v: Em) => `margin:${em(v)};`;
const mt = (v: Em) => `margin-${t(v)};`;
const mb = (v: Em) => `margin-${b(v)};`;
const ml = (v: Em) => `margin-${l(v)};`;
const mr = (v: Em) => `margin-${r(v)};`;
const mx = (v: Em) => ml(v) + mr(v);
const my = (v: Em) => mt(v) + mb(v);

const p = (v: Em) => `padding:${em(v)};`;
const pt = (v: Em) => `padding-${t(v)};`;
const pb = (v: Em) => `padding-${b(v)};`;
const pl = (v: Em) => `padding-${l(v)};`;
const pr = (v: Em) => `padding-${r(v)};`;
const px = (v: Em) => pl(v) + pr(v);
const py = (v: Em) => pt(v) + pb(v);

type Em = number | string | (number | string)[];
const em = (v: Em): string =>
  typeof v === 'number' ? v + 'rem' : typeof v === 'string' ? v : v.map(em).join(' ');
const cssFunMap = {
  x,
  y,
  xy,

  l,
  t,
  r,
  b,

  w,
  h,
  wh,

  wMax,
  hMax,
  whMax,

  wMin,
  hMin,
  whMin,

  fontSize,

  m,
  mt,
  mb,
  ml,
  mr,
  mx,
  my,

  p,
  pt,
  pb,
  pl,
  pr,
  px,
  py,

  elevation: (v: number) =>
    `box-shadow:${em(v * 0.1)} ${em(v * 0.2)} ${em(v * 0.25)} 0px ${_colors.shadow || '#000000AA'};`,
  rounded: (v: number) => `border-radius:${em(v * 0.2)};`,

  inset,

  bg: (v: string) => `background-color:${_colors[v] || v};`,
  fg: (v: string) => `color:${_colors[v] || v};`,
  border: (v: number | string) => `border:${_colors[v] ? `${_colors[v]} 1px solid` : v};`,
  bgUrl: (v: string) => `background-image: url("${v}");`,
  bgMode: (v: 'contain' | 'cover' | 'fill') =>
    `background-repeat:no-repeat;background-position:center;background-size:${v === 'fill' ? '100% 100%' : v};`,

  itemFit: (v: 'contain' | 'cover' | 'fill') =>
    v === 'contain'
      ? `object-fit:contain;max-width:100%;max-height:100%;`
      : v === 'cover'
        ? `object-fit:cover;min-width:100%;min-height:100%;`
        : v === 'fill'
          ? `object-fit:fill;min-width:100%;min-height:100%;`
          : '',

  anim: animToCss,
  transition: (v: number | string | boolean) =>
    typeof v === 'number'
      ? `transition:all ${v}s ease;`
      : typeof v === 'string'
        ? `transition:${v};`
        : v === true
          ? 'transition:all 0.3s ease;'
          : '',

  rotate: transformProp('rotate'),

  scale: transformProp('scale'),
  scaleX: transformProp('scaleX'),
  scaleY: transformProp('scaleY'),

  translate: transformProp('translate'),
  translateX: transformProp('translateX'),
  translateY: transformProp('translateY'),
};

type CssFunMap = typeof cssFunMap;
export type CssRecord =
  | JSX.CSSProperties
  | {
      [K in keyof CssFunMap]?: Parameters<CssFunMap[K]>[0];
    }
  | (JSX.CSSProperties & {
      [K in keyof CssFunMap]?: Parameters<CssFunMap[K]>[0];
    });
export type CssValue = null | string | string[] | Record<string, CssRecord>;

const _cssMap: { [key: string]: [HTMLElement, CssValue] } = {};

export const setCss = (key: string, css?: CssValue) => {
  const old = _cssMap[key];
  if (old) {
    if (isEq(old[1], css)) return key;
    old[0].remove();
    delete _cssMap[key];
  }
  if (css) {
    const el = createEl('style');
    let content = '';
    if (typeof css === 'object') {
      if (isList(css)) {
        content = css.join('\n');
      } else {
        const sb: string[] = [];
        const kPrefix = '.' + key;
        for (const k in css) {
          const ctx: CssContext = { key, css };
          sb.push(`${k.replace(/&/g, kPrefix)} {`);
          const props = css[k];
          for (const prop in props) {
            const value = (props as any)[prop];
            if (prop in cssFunMap) {
              sb.push('  ' + (cssFunMap as any)[prop](value, ctx));
            } else {
              const name = prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
              sb.push(`  ${name}:${value};`);
            }
          }
          if (ctx.t) sb.push(`  transform: ${ctx.t.join(' ')};`);
          sb.push('}');
          if (ctx.a) sb.push(...ctx.a);
        }
        content = sb.join('\n');
      }
    } else {
      content = String(css);
    }
    el.textContent = content;
    document.head.appendChild(el);
    _cssMap[key] = [el, css];
  }
  return key;
};

export const Css = (key: string, css?: CssValue) => {
  let isInit = false;
  return (...args: (string | undefined | { class?: string })[]) => {
    if (!isInit) {
      setCss(key, css);
      isInit = true;
    }
    if (args.length === 0) return key;
    const sb = [];
    for (const arg of args) {
      if (isStr(arg)) {
        sb.push(key + arg);
      } else if (isItem(arg)) {
        arg.class && sb.push(arg.class);
      }
    }
    return sb.join(' ');
  };
};

export const refreshCss = () => {
  const map = _cssMap;
  for (const key in map) setCss(key, null);
  for (const key in map) setCss(key, map[key][1]);
};

export const setCssColors = (colors: Record<string, string>) => {
  _colors = colors;
  refreshCss();
};

export const htmlToEl = (html: string) => {
  const el = createEl('div');
  el.innerHTML = html;
  return el.children[0];
};

export const setStyle = (el: HTMLElement, style: Style | string, update?: boolean) => {
  if (typeof style === 'string') return setAttrs(el, { style }, true);
  if (!update) setAttrs(el, { style: '' }, true);
  Object.assign(el.style, style);
};

export type ElOptions = Omit<Omit<Partial<HTMLAllElement>, 'children'>, 'style'> & {
  readonly reset?: boolean;
  readonly cls?: Cls;
  readonly style?: Style;
  readonly attrs?: Record<string, any>;
  readonly children?: HTMLElement[];
  readonly ctn?: string;
  readonly parent?: 'body' | HTMLElement;
};

export const El = (el: HTMLElement | keyof HTMLElementTagNameMap, o?: ElOptions) => {
  const id = o?.id;
  const last = id && document.getElementById(id);
  el = typeof el === 'string' ? last || createEl(el) : el;
  if (id) el.id = id;

  if (!o) return el;

  const { reset, attrs, style, cls, children, ctn, parent, ...rest } = o;

  if (reset) setAttrs(el, {});
  if (attrs) setAttrs(el, attrs, true);
  if (style) setStyle(el, style, true);
  if (cls) setCls(el, cls);
  if (ctn) el.innerHTML = ctn;
  if (parent) (parent === 'body' ? document.body : parent).appendChild(el);

  Object.assign(el, rest);

  if (children) for (const childEl of children) el.appendChild(childEl);

  return el;
};

export const setEl = (el: HTMLElement, options?: ElOptions) => El(el, options);
export const addEl = (tag: keyof HTMLElementTagNameMap = 'div', options?: ElOptions) =>
  El(tag, options);

// for (const el of els) el && containerEl.appendChild(el);
//     const el =  as HTMLElement;
//     return ;
// };

// export const newDialog = (options: ElOptions = {}) => {
//     setCss('mDialog', '.mDialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999999;' +
//         'min-width: 30%; max-width: 90%; min-height: 30%; max-height: 90%; overflow: auto; padding: 10px;' +
//         'background-color: white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); border-radius: 7px;' +
//         'display: flex; flex-direction: column; align-items: stretch; justify-content: space-around; }');
//     return setEl('div', { ...options, cls: { ...options.cls, mDialog: 1 } });
// }

// let progDialogEl: HTMLElement;
// export const newProg = ({ title, max, ...options }: Omit<ElOptions, 'max'> & { title: string, max?: number }) => {
//     if (!max) max = 100;
//     setCss('mProg',
//         '.mProg { border-radius: 5px; margin: 5px; }' +
//         '.mProgTitle { text-align: center; font-weight: bold; font-size: 1.2rem; margin: 5px; color: #666666; }' +
//         '.mProgTitle b { font-weight: bold; font-size: 2rem; margin-right: 5px; color: #0072c3; }' +
//         '.mProgBar { height: 1rem; background: #e0e0e0; border-radius: 99px; overflow: hidden; margin: 5px; }' +
//         '.mProgVal { height: 100%; width: 0%; background: #0043ce; border-radius: 99px; transition: all 0.5s; }'
//     );
//     const valEl = setEl('div', { cls: { mProgVal: 1 } });
//     const barEl = setEl('div', { cls: { mProgBar: 1 }, children: [valEl] });
//     const titleEl = setEl('span', { cls: { mProgTitle: 1 }, ctn: title });
//     const el = setEl('div', {
//         ...options,
//         cls: { ...options.cls, mProg: 1 },
//         children: [titleEl, barEl],
//     });
//     const dialogEl = progDialogEl || (progDialogEl = newDialog());
//     let timeoutId: any;
//     let curr: number = -1;
//     const set = (value: number) => {
//         clearTimeout(timeoutId);
//         if (value >= max) value = max;
//         if (curr === value) return;
//         curr = value;
//         if (!dialogEl.parentElement) document.body.append(dialogEl);
//         if (!el.parentElement) dialogEl.append(el);
//         valEl.style.width = (100*value/max) + '%';
//         setEl(titleEl, { ctn: `<b>${round(100*value/max)}%</b>${title}` });
//         if (value !== max) return;
//         timeoutId = setTimeout(() => {
//             el.remove();
//             if (dialogEl.children.length === 0) dialogEl.remove();
//         }, 1000);
//     };
//     set(0);
//     return set;
// }

export const setSiteTitle = (title: string) => {
  const titleEl = document.getElementsByTagName('title')[0];
  if (titleEl) titleEl.innerText = title;
  document.title = title;
};
