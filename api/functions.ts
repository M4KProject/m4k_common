import { apiReq } from "./Coll.ts";
import { timeOffset$ } from "./messages.ts";

export const fun = apiReq('');

let _isTimeInit = false;
export const initTimeOffset = () => {
  if (_isTimeInit) return;
  _isTimeInit = true;
  const start = Date.now();
  return fun('GET', 'now').then(now => {
    const localTime = (start + Date.now()) / 2;
    const serverTime = new Date(now).getTime();
    console.debug('sync time', localTime, serverTime);
    const timeOffset = serverTime - localTime;
    timeOffset$.set(serverTime - localTime);
    return timeOffset;
  });
}
