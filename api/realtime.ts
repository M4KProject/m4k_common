/// <reference lib="dom" />
import { Req } from "../helpers/req";
import { parse } from "../helpers/json";
import { pathJoin } from "../helpers/pathJoin";
import { getApiUrl } from "./messages";
import { toErr } from "@common/helpers";

const initRealtime = () => {
  let clientId: string = "";
  let eventSource: EventSource|undefined = undefined;
  let xhr: XMLHttpRequest|undefined = undefined;
  let intervalId: any;
  let lastState = "";
  const subscriptions: Record<string, ((data: any) => void)[]> = {};
  const realtimeUrl = pathJoin(getApiUrl(), 'realtime');

  const isConnected = (): boolean => !!eventSource && !!clientId;
  
  const addAllListeners = (eventSource: EventSource) => {
    console.debug('realtime addAllListeners', eventSource);
    for (const key in subscriptions) {
      const listeners = subscriptions[key];
      for (const listener of listeners) {
        eventSource.addEventListener(key, listener);
      }
    }
  }
  
  const disconnect = () => {
    console.debug('realtime disconnect', !!xhr, !!eventSource, clientId);
    if (xhr) {
      xhr.abort();
      xhr = undefined;
    }
    if (eventSource) {
      eventSource.close();
      eventSource = undefined;
    }
    clientId = "";
  }
  
  const connect = async () => {
    console.debug('realtime connect', { realtimeUrl  });
    await disconnect();
    await new Promise<void>(resolve => {
      eventSource = new EventSource(realtimeUrl);
      eventSource.addEventListener("PB_CONNECT", (e: MessageEvent) => {
        console.debug('PB_CONNECT', e);
        if (!e) return console.warn('PB_CONNECT e');
        const id = (parse(e.data) || {}).clientId;
        if (!id) return console.warn('PB_CONNECT id');
        clientId = id;
        resolve();
      });
    });
    console.debug('realtime connected', { clientId });
  }
  
  const update = async (req: Req) => {
    try {
      console.debug('realtime update');
      clearInterval(intervalId);
      intervalId = setInterval(() => update(req), 10000);

      const state = Object.keys(subscriptions).join(',') + isConnected();
      if (state === lastState) return;
      lastState = state;

      const subscriptionKeys: string[] = [];
      for (const key in subscriptions) {
        if (!subscriptions[key].length) {
          delete subscriptions[key];
        }
        else {
          subscriptionKeys.push(key);
        }
      }
      console.debug('realtime update keys', subscriptionKeys);

      if (!subscriptionKeys.length) return await disconnect();
      if (!isConnected()) await connect();


//         await ky.post(this.getRealtimeUrl(), {
//             json: {
//                 clientId: this.clientId,
//                 subscriptions: this.lastSentSubscriptions,
//             },
//             headers: {
//                 Authorization: this.tokenRef.token,
//             },
//             signal: (this.cancel = new AbortController()).signal
//         });
      await req('POST', realtimeUrl, {
        xhr: true,
        json: {
          clientId,
          subscriptions: subscriptionKeys,
        },
        headers: {
          'content-type': 'application/json',
        },
        before: (ctx) => {
          xhr = ctx.xhr;
        }
      });

      xhr = undefined;
      if (eventSource) addAllListeners(eventSource);
    }
    catch (e) {
      const error = toErr(e);
      console.error('realtime update', error);
    }
  }

  return {
    subscriptions,
    update,
  }
}

export const realtime = initRealtime();