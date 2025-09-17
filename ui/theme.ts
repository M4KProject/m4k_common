import { setCssColors } from './html';
import { lighten, setHsl, addHsl } from '../utils/color';

export const setTheme = (
  primary: string,
  secondary?: string,
  { colors }: { colors?: Record<string, string> } = {}
) => {
  if (!secondary) secondary = addHsl(primary, { h: 180 });

  // const _lighten = isDark ? darken : lighten;
  // const _setHsl = isDark ? (c: any, v: Partial<HslColor>) => {
  //     if (v.l) v.l = 100 - v.l;
  //     return setHsl(c, v);
  // } : setHsl;

  // isDark ? lighten : darken

  const grey = '#808080';
  // const bg = lighten(grey, 40);
  const fg = lighten(grey, -50);

  setCssColors({
    primary,
    secondary,

    bg: '#f4f7fe',
    fg: '#9aaabd',
    selectedFg: '#0a536f',
    // selected: lighten(primary, 20),

    // sideFg: '#f4f7fe',
    // bg: _setHsl(primary, { l: 97 }),
    // fg,

    headerBg: 'transparent',
    headerTitle: '#0a536f',

    tooltipBg: '#0a536f',
    tooltipFg: '#ffffff',

    btnBg: 'transparent',
    btnFg: fg,

    labelFg: lighten(primary, -40),

    btnBgHover: '',
    btnFgHover: '',

    info: setHsl(primary, { h: 240 }),
    success: setHsl(primary, { h: 120, l: 40 }),
    error: setHsl(primary, { h: 0 }),
    warn: setHsl(primary, { h: 30 }),
    selected: '#0a536f',

    shadow: '#11698a1c',

    ...colors,
  });
};

// import Msg from "../utils/Msg";
// import { lighten, darken, setHsl, addHsl } from '../utils/color';
// import { CssRecord, setCss } from "../ui/html";

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
