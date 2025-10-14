import { TMap } from '@common/utils/types';

// deno-lint-ignore-file no-window
export const updateUrlParams = (update: TMap<string>) => {
  const queryParams = new URLSearchParams(window.location.search);
  let count = 0;
  for (const prop in update) {
    const value = update[prop];
    if (value && queryParams.get(prop) !== value) {
      queryParams.set(prop, value);
      count++;
    }
  }
  if (count > 0) {
    window.history.pushState(null, '', `?${queryParams}`);
  }
};

export const readUrlParams = () => {
  let match;
  const pl = /\+/g; // Regex for replacing addition symbol with a space
  const search = /([^&=]+)=?([^&]*)/g;
  const decode = (s: string) => decodeURIComponent(s.replace(pl, ' '));
  const query = window.location.search.substring(1);
  const urlParams: TMap<string> = {};
  const urlParams2: TMap<string> = {};
  while ((match = search.exec(query))) {
    const key = match[1];
    const value = match[2];
    if (key && value) {
      urlParams[decode(key).toLowerCase()] = decode(value);
      urlParams2[decode(key)] = decode(value);
    }
  }
  return { ...urlParams, ...urlParams2 };
};
