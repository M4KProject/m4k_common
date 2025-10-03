import { TMap } from './types';

export const clean = (arg: string): string =>
  arg
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]/g, ' ')
    .trim();

export const isSearched = (
  source: string | null | undefined,
  search: string | null | undefined
) => {
  if (!search) return true;
  if (!source) return false;
  const sourceCleaned = clean(source).toLowerCase();
  const searchTags = clean(search).toLowerCase().split(' ');
  for (const tag of searchTags) {
    if (sourceCleaned.indexOf(tag) === -1) return false;
  }
  return true;
};

/**
 * words("abc") -> ["abc"]
 * words("abcDef") -> ["abc", "def"]
 * words("abc def") -> ["abc", "def"]
 * @param arg
 * @returns
 */
export const words = (arg: string): string[] =>
  clean(arg)
    .replace(/[a-z0-9][A-Z]/g, (s) => s[0] + ' ' + s[1].toLowerCase())
    .replace(/[^a-z0-9A-Z]+/g, () => ' ')
    .toLowerCase()
    .split(' ')
    .filter((s) => s);

export const pascal = (arg: any): string => words(arg).map(firstUpper).join('');

export const camel = (arg: string): string => firstLower(pascal(arg));

export const firstLower = (arg: string): string =>
  arg ? arg[0].toLowerCase() + arg.substring(1) : arg;

export const firstUpper = (arg: string): string =>
  arg ? arg[0].toUpperCase() + arg.substring(1) : arg;

/**
 * @param val
 * @param replaceBySearch
 * @returns
 * @example replace("toto tututoto b!", { toto: 5, b: 'ok' }) => "5 tutu5 ok!"
 */
export const replace = (val: string, replaceBySearch: TMap<any>): string => {
  val = String(val);
  if ((val as any).replaceAll) {
    for (const key in replaceBySearch)
      val = (val as any).replaceAll(key, replaceBySearch[key] as string);
    return val;
  }
  for (const key in replaceBySearch)
    val = val.replace(
      new RegExp(key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'),
      replaceBySearch[key]
    );
  return val;
};

/**
 * @param template "toto {titi} tutu{titi}" + { titi: 5 } => "toto 5 tutu5"
 * @param replaceByKey
 * @returns
 * @example setTemplate("toto {a} tutu{a} {b}!", { a: 5, b: 'ok' }) => "toto 5 tutu5 ok!"
 */
export const setTemplate = (template: string, replaceByKey: TMap<any>): string =>
  template.replace(/\{(\w+)\}/g, (s, k) => replaceByKey[k] || s);

export const randStr = (count: number, chars: string = 'abcdefghjkmnpqrstuvwxyz23456789') => {
  const charset = chars.split('');
  let result = '';

  if (typeof crypto === 'object' && crypto.getRandomValues) {
    const buff = new Uint32Array(count);
    crypto.getRandomValues(buff);
    for (let i = 0; i < count; i++) {
      result += charset[buff[i] % charset.length];
    }
  } else {
    for (let i = 0; i < count; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  return result;
};

export const randKey = (count: number) =>
  randStr(count, 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789');
export const randHex = (count: number) => randStr(count, '0123456789abcdef');

export const uuid = (): string => {
  if (typeof crypto === 'object' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const h = randHex;
  return `${h(8)}-${h(4)}-4${h(3)}-8${h(3)}-${h(12)}`;
};

/**
 * Ajoute des charactéres devant la valeur pour atteindre une longueur donnée
 * @param value Valeur à formater
 * @param length Longueur désirée
 * @param fill Caractère de remplissage (défaut: '0')
 */
export const pad = (value: number | string, length: number, fill: number | string = '0'): string =>
  String(value).padStart(length, String(fill));

/**
 * Ajoute des charactéres après la valeur pour atteindre une longueur donnée
 * @param value Valeur à formater
 * @param length Longueur désirée
 * @param fill Caractère de remplissage (défaut: '0')
 */
export const padEnd = (
  value: number | string,
  length: number,
  fill: number | string = '0'
): string => String(value).padEnd(length, String(fill));
