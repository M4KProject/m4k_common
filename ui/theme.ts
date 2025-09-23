import { Dict, isItem, Msg } from '@common/utils';
import { setColors } from './css';
import { darken, lighten, setHsl, addHsl, toHsl, toColor } from '@common/utils/color';

export interface ThemeInfo {
  isDark?: boolean;
  contrast?: number;
  primary?: string;
  secondary?: string;
  colors?: Dict<string>;
}

export const theme$ = new Msg<ThemeInfo>({}, 'theme$', true, isItem);

export const setTheme = (changes?: Partial<ThemeInfo>) => {
  theme$.next(prev => ({ ...prev, ...changes }));
}

export const newColors = (p: string, color: string, isDark: boolean = false) => {
  const { h, s, l } = toHsl(color);
  
  const c = (lvl: number) => {
    if (lvl === 0) return isDark ? '#000000' : '#ffffff';
    if (lvl === 100) return isDark ? '#ffffff' : '#000000';
    
    const n = lvl / 100;
    const ci = (Math.cos((lvl - 50) * Math.PI / 50) + 1) / 2;
    const tL = isDark ? n * 100 : (1 - n) * 100;
    const fL = l * ci + tL * (1 - ci);
    
    return toColor({
      h,
      s: s * (0.3 + 0.7 * ci),
      l: fL
    });
  };
  
  return {
    [`${p}0`]: c(0),
    [`${p}5`]: c(5),
    [`${p}10`]: c(10),
    [`${p}20`]: c(20),
    [`${p}30`]: c(30),
    [`${p}40`]: c(40),
    [`${p}50`]: c(50),
    [`${p}60`]: c(60),
    [`${p}70`]: c(70),
    [`${p}80`]: c(80),
    [`${p}90`]: c(90),
    [`${p}100`]: c(100),
  };
};

export const refreshTheme = () => {
  const theme = theme$.v;

  const isDark = theme.isDark || false;
  const contrast = theme.contrast || 50;
  const primary = theme.primary || '#28A8D9';
  const secondary = theme.secondary || addHsl(primary, { h: 180 });
  const colors = theme.colors || {};

  const l = isDark ? darken : lighten;

  // const newColors = (p: string, color: string) => {
  //   const { h, s, l } = toHsl(color);
  //   const c = (v: number) => toColor({ h, s, l: l + v });
  //   return {
  //     [p+0]: c(50),
  //     [p+5]: c(40),
  //     [p+10]: c(35),
  //     [p+20]: c(25),
  //     [p+30]: c(15),
  //     [p+40]: c(5),
  //     [p+50]: c(0),
  //     [p+60]: c(-10),
  //     [p+70]: c(-20),
  //     [p+80]: c(-30),
  //     [p+90]: c(-40),
  //     [p+100]: c(-50),
  //   };
  // }

  const info = setHsl(primary, { h: 240 });
  const success = setHsl(primary, { h: 120, l: 40 });
  const error = setHsl(primary, { h: 0 });
  const warn = setHsl(primary, { h: 30 });
  const selected = primary;
  const shadow = '#11698a1c';

  // const bg = lighten(grey, 40);
  const bg = l('#aaa', contrast);
  const fg = l('#aaa', -contrast);

  const side = l(primary, contrast);
  const body = l(primary, 0.9 * contrast);
  const toolbar = l(primary, 0.95 * contrast);

  const tr = l(primary, 0.95 * contrast);
  const trEven = l(primary, 0.9 * contrast);
  const trHover = l(primary, 0.8 * contrast);

  setColors({
    ...newColors('p', primary, isDark),
    ...newColors('s', secondary, isDark),

    primary,
    secondary,

    side,
    body,
    toolbar,

    bg,
    fg,
    selectedFg: '#0a536f',
    // selected: lighten(primary, 20),

    // bg: _setHsl(primary, { l: 97 }),
    // fg,

    headerBg: 'transparent',
    headerTitle: '#0a536f',

    tooltipBg: '#0a536f',
    tooltipFg: '#ffffff',

    btnBg: 'transparent',
    btnFg: fg,

    labelFg: l(primary, -40),

    btnBgHover: '',
    btnFgHover: '',

    info,
    success,
    error,
    warn,
    selected,

    shadow,

    tr,
    trEven,
    trHover,

    ...colors,
  });
};

// import Msg from "@common/utils/Msg";
// import { lighten, darken, setHsl, addHsl } from '@common/utils/color';
// import { CssRecord, setCss } from "@common/ui/html";

// export interface ThemeItem {
//     color: string,
//     bg: string,
//     text: string,
//     border: string,
// }

// export interface Theme {
//     isDark: boolean,
//     contrast: (color: any, amount?: number) => string,
//     primary: ThemeItem,
//     secondary: ThemeItem,
//     default: ThemeItem,
//     info: ThemeItem,
//     warn: ThemeItem,
//     error: ThemeItem,
//     success: ThemeItem,
//     base: ThemeItem,
//     add: ThemeItem,
//     selected: ThemeItem,
// }

// export const theme$ = new Msg<Theme|null>(null)

// export const createTheme = (primary: string, secondary?: string|null, isDark: boolean = false) => {
//     const contrast = isDark ? lighten : darken
//     const item = (color: string): ThemeItem => ({
//         color,
//         bg: color, // linear-gradient(to right, blue, pink)
//         text: contrast(color, 30),
//         border: contrast(color, 10),
//     });

//     const grey = { r: 128, g: 128, b: 128 }
//     const bg = contrast(grey, -100)
//     const text = contrast(grey, +100)

//     const primaryItem = item(primary)
//     const secondaryItem = item(secondary || addHsl(primary, { h: 180 }))

//     const theme: Theme = {
//         isDark,
//         contrast,
//         primary: primaryItem,
//         secondary: secondaryItem,
//         default: item(setHsl(primary, { s: 0 })),
//         info: item(setHsl(primary, { h: 240 })),
//         warn: item(setHsl(primary, { h: 30 })),
//         error: item(setHsl(primary, { h: 0 })),
//         success: item(setHsl(primary, { h: 120 })),
//         base: { color: text, bg, text, border: text },
//         add: primaryItem,
//         selected: secondaryItem,
//     }

//     return theme
// }

// export type ThemeColor = 'primary'|'secondary'|'default'|'info'|'warn'|'error'|'success'|'base'|'add'|'selected'

// export const tPrefix = 't-'

// export const tCls = (color: ThemeColor) => tPrefix + color;

// theme$.on(theme => {
//     const toCss = (color: ThemeItem, isNormal?: boolean): CssRecord => ({
//         fg: color.text,
//         bg: color.bg,
//         borderColor: color.border,
//         fontWeight: isNormal ? 'normal' : 'bold',
//     })

//     setCss('theme', theme ? {
//         [tCls('primary')]: toCss(theme.primary),
//         [tCls('secondary')]: toCss(theme.secondary),
//         [tCls('default')]: toCss(theme.default, true),
//         [tCls('info')]: toCss(theme.info),
//         [tCls('warn')]: toCss(theme.warn),
//         [tCls('error')]: toCss(theme.error),
//         [tCls('success')]: toCss(theme.success),
//         [tCls('base')]: toCss(theme.base, true),
//         [tCls('add')]: toCss(theme.add),
//         [tCls('selected')]: toCss(theme.selected),
//     } : null)
// })
