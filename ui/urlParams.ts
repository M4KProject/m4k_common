import { TMap } from '@common/utils/types';

export const getUrlParams = (url: string): TMap<string> => {
  let match;
  const pl = /\+/g;
  const search = /([^&=]+)=?([^&]*)/g;
  const decode = (s: string) => decodeURIComponent(s.replace(pl, ' '));
  const queryIndex = url.indexOf('?');
  const query = queryIndex >= 0 ? url.substring(queryIndex + 1) : '';
  const urlParams: TMap<string> = {};
  while ((match = search.exec(query))) {
    const key = match[1];
    const value = match[2];
    if (key && value) {
      urlParams[decode(key)] = decode(value);
    }
  }
  return { ...urlParams };
};

export const updateUrlParams = (url: string, params: TMap<string>): string => {
  const parts = url.split('#');
  const baseUrl = parts[0] || '';
  const hash = parts[1];
  const path = baseUrl.split('?')[0];

  const existingParams = getUrlParams(url);
  const mergedParams = { ...existingParams, ...params };

  const pairs: string[] = [];
  for (const key in mergedParams) {
    const value = mergedParams[key];
    if (value !== undefined && value !== null && value !== '') {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }

  const newQuery = pairs.join('&');
  return path + (newQuery ? '?' + newQuery : '') + (hash ? '#' + hash : '');
};

export const replaceUrlParams = (url: string, params: TMap<string>): string => {
  const parts = url.split('#');
  const baseUrl = parts[0] || '';
  const hash = parts[1];
  const path = baseUrl.split('?')[0];

  const pairs: string[] = [];
  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }

  const newQuery = pairs.join('&');
  return path + (newQuery ? '?' + newQuery : '') + (hash ? '#' + hash : '');
};
