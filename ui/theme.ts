import { isItem, Msg } from '@common/utils';
import { setColors } from './css';
import { setHsl, addHsl, toHsl, toColor } from '@common/utils/color';

export interface ThemeInfo {
  mode?: 'dark' | 'light';
  primary?: string;
  secondary?: string;
  grey?: string;
  [key: string]: string;
}

export const theme$ = new Msg<ThemeInfo>({}, 'theme$', true, isItem);

export const setTheme = (changes?: Partial<ThemeInfo>) => {
  theme$.next((prev) => ({ ...prev, ...changes }));
};

export const newColors = (p: string, color: string, isDark: boolean = false) => {
  const hsl = toHsl(color);
  const { h, s, l } = hsl;
  const rL = l / 100;
  const results = {};
  for (let i = 0; i <= 100; i += 5) {
    const k = p + i;
    const r = 2 * (i / 100);
    const nL = r < 1 ? rL * r : rL + (1 - rL) * (r - 1);
    const c = toColor({ h, s, l: nL * 100 });
    results[k] = c;
  }
  return results;
};

export const refreshTheme = () => {
  const theme = theme$.v;

  const isDark = theme.mode === 'dark';

  const t = { ...theme };
  delete t.mode;

  const primary = t.primary || '#28A8D9';
  const secondary = t.secondary || addHsl(primary, { h: 360 / 3 });
  const grey = t.grey || setHsl(t.primary, { s: 0 });
  const white = '#ffffff';
  const black = '#000000';
  const bg = isDark ? black : white;
  const fg = isDark ? white : black;

  Object.assign(
    t,
    {
      primary,
      secondary,
      grey,
      white,
      black,
      bg,
      fg,
    },
    theme
  );

  Object.assign(
    t,
    {
      ...newColors('p', primary, isDark),
      ...newColors('s', secondary, isDark),
      ...newColors('g', grey, isDark),
      info: setHsl(primary, { h: 240 }),
      success: setHsl(primary, { h: 120, l: 40 }),
      error: setHsl(primary, { h: 0 }),
      warn: setHsl(primary, { h: 30 }),
      selected: secondary,
      shadow: isDark ? '#ffffff20' : '#00000020',
    },
    theme
  );

  Object.assign(
    t,
    {
      side: isDark ? t.g20 : t.p90,
      body: isDark ? t.bg : t.bg,
      toolbar: isDark ? t.g10 : t.p50,
      toolbarFg: white,
      tr: isDark ? t.g5 : t.p95,
      trEven: isDark ? t.g10 : t.p90,
      trHover: isDark ? t.g20 : t.p80,
      button: isDark ? t.g5 : t.g95,
    },
    theme
  );

  setColors(t);

  //   bg,
  //   fg,
  //   selectedFg: '#0a536f',
  //   // selected: lighten(primary, 20),

  //   // bg: _setHsl(primary, { l: 97 }),
  //   // fg,

  //   headerBg: 'transparent',
  //   headerTitle: '#0a536f',

  //   tooltipBg: '#0a536f',
  //   tooltipFg: '#ffffff',

  //   btnBg: 'transparent',
  //   btnFg: fg,

  //   labelFg: l(primary, -40),

  //   btnBgHover: '',
  //   btnFgHover: '',

  //   info,
  //   success,
  //   error,
  //   warn,
  //   selected,

  //   shadow,

  //   tr,
  //   trEven,
  //   trHover,

  //   ...colors,
  // });
};
