import { setCssColors } from './html';
import { darken, lighten, setHsl, addHsl } from '@common/utils/color';

export const setTheme = (
  isDark: boolean = false,
  contrast: number = 100,
  primary: string = '#28A8D9',
  secondary?: string,
  { colors }: { colors?: Record<string, string> } = {}
) => {
  contrast = 0.5 * contrast;

  if (!secondary) secondary = addHsl(primary, { h: 180 });

  const l = isDark ? darken : lighten;

  const grey = '#808080';
  const info = setHsl(primary, { h: 240 });
  const success = setHsl(primary, { h: 120, l: 40 });
  const error = setHsl(primary, { h: 0 });
  const warn = setHsl(primary, { h: 30 });
  const selected = primary;
  const shadow = '#11698a1c';

  // const bg = lighten(grey, 40);
  const bg = l(grey, contrast);
  const fg = l(grey, -contrast);

  const side = l(primary, contrast);
  const body = l(primary, 0.9 * contrast);
  const toolbar = l(primary, 0.95 * contrast);

  setCssColors({
    primary,
    secondary,

    side,
    body,
    toolbar,

    bg,
    fg,
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

    labelFg: l(primary, -40),

    btnBgHover: '',
    btnFgHover: '',

    info,
    success,
    error,
    warn,
    selected,

    shadow,

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
