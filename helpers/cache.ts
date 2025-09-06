import { parse, stringify } from "./json";
import { isList } from "./check";

type Cache<T> = ['CACHE', number, T];

const cache = async <T>(key: string, expiredMs: number, load: () => Promise<T>): Promise<T> => {
  console.debug('cache', key, expiredMs);
  if (expiredMs !== 0) {
    const lastJson = localStorage.getItem(key);
    if (lastJson) {
      const last = parse(lastJson) as Cache<T>;
      if (isList(last) && last[0] === 'CACHE') {
        const expired = last[1] + expiredMs;
        const isExpired = expired < Date.now();
        console.debug('cache loaded', key, last, expired, isExpired ? 'expired' : 'ok');
        if (!isExpired) return last[2];
      }
    }
  }
  const value = await load();
  const next: Cache<T> = ['CACHE', Date.now(), value];
  await localStorage.setItem(key, stringify(next));
  console.debug('cache saved', key, value);
  return value;
};

export default cache;