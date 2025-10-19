import { TMap } from './types';

interface Logger {
  d: (...args: any[]) => void;
  i: (...args: any[]) => void;
  w: (...args: any[]) => void;
  e: (...args: any[]) => void;
}

const cache: TMap<Logger> = {};

let log = (tag: string, level: 'd' | 'i' | 'w' | 'e', args: any[]) => {
  switch (level) {
    case 'd':
      console.debug(tag, ...args);
      break;
    case 'i':
      console.info(tag, ...args);
      break;
    case 'w':
      console.warn(tag, ...args);
      break;
    case 'e':
      console.error(tag, ...args);
      break;
  }
};

export const setLog = (next: typeof log) => (log = next);

const newLogger = (tag: string): Logger => {
  const TAG = tag ? `[${tag}] ` : '';
  return {
    d: (...args: any[]) => log(TAG, 'd', args),
    i: (...args: any[]) => log(TAG, 'i', args),
    w: (...args: any[]) => log(TAG, 'w', args),
    e: (...args: any[]) => log(TAG, 'e', args),
  };
};

export const logger = (tag: string) => cache[tag] || (cache[tag] = newLogger(tag));

const base = logger('');
export const debug = base.d;
export const info = base.i;
export const warn = base.w;
export const error = base.e;
