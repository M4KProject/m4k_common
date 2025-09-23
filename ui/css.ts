import { toStr } from '@common/utils/cast';
import { Dict, isEq, isItem, isList, isNbr, isStr } from '@common/utils/check';
import { JSX } from 'preact/jsx-runtime';
import { createEl } from './html';
import { sort } from '@common/utils/list';

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

export type FlexDirection = '' | 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = '' | 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify =
  | ''
  | 'start'
  | 'center'
  | 'end'
  | 'evenly'
  | 'space-between'
  | 'space-around';

const displayFlex = (direction: FlexDirection, align: FlexAlign, justify: FlexJustify) =>
  [
    'display:flex;',
    direction ? `flex-direction:${direction};` : '',
    align ? `align-items:${align};` : '',
    justify ? `justify-content:${justify};` : '',
  ].join('');

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

  fRow: (v: 1 | [] | [FlexAlign] | [FlexAlign, FlexJustify]) =>
    v && displayFlex('row', toStr(v[0], 'center'), toStr(v[1], 'space-between')),
  fCol: (v: 1 | [] | [FlexAlign] | [FlexAlign, FlexJustify]) =>
    v && displayFlex('column', toStr(v[0], 'stretch'), toStr(v[1], 'start')),
  fCenter: (v: 1 | [] | [FlexDirection]) => v && displayFlex(v[0] || 'column', 'center', 'center'),
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
export type CssValue = null | string | string[] | Dict<CssRecord>;

const _cssMap: { [key: string]: [HTMLElement, CssValue, number] } = {};

let cssCount = 0;

export const setCss = (key: string, css?: CssValue, order?: number) => {
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
          const query = k.startsWith('.')
            ? k
            : (k.startsWith('&') ? k : '&' + k).replace(/&/g, kPrefix);
          sb.push(`${query} {`);
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
    _cssMap[key] = [el, css, order || cssCount++];

    Object.values(_cssMap)
      .sort((a, b) => a[2] - b[2])
      .map((p) => {
        document.head.appendChild(p[0]);
      });
  }
  return key;
};

export const Css = (key: string, css?: CssValue) => {
  const order = cssCount++;
  let isInit = false;
  return (...args: (string | undefined | { class?: string })[]) => {
    if (!isInit) {
      setCss(key, css, order);
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
  for (const key in map) {
    const [,css,order] = map[key];
    setCss(key, css, order);
  }
};

export const setCssColors = (colors: Record<string, string>) => {
  _colors = colors;
  refreshCss();
};
