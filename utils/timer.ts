import { randString } from './rand';
import { global } from './global';
import { TMap } from './types';

const timers: TMap<any> = global.m4kTimers || (global.m4kTimers = {});

export const timer = (id: null | string, ms: number, cb: null | (() => void)) => {
  if (!id) id = randString(10) + Date.now();
  if (timers[id]) {
    clearInterval(timers[id]);
    delete timers[id];
  }
  if (ms > 0 && cb) {
    timers[id] = setInterval(cb, ms);
  }
};
