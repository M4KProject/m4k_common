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
  theme$.next((prev) => ({ ...prev, ...changes }));
};

export const newColors = (p: string, color: string, isDark: boolean = false) => {
  const { h, s, l } = toHsl(color);

  const c = (lvl: number) => {
    if (lvl === 0) return isDark ? '#000000' : '#ffffff';
    if (lvl === 100) return isDark ? '#ffffff' : '#000000';

    const n = lvl / 100;
    const ci = (Math.cos(((lvl - 50) * Math.PI) / 50) + 1) / 2;
    const tL = isDark ? n * 100 : (1 - n) * 100;
    const fL = l * ci + tL * (1 - ci);

    return toColor({
      h,
      s: s * (0.3 + 0.7 * ci),
      l: fL,
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
