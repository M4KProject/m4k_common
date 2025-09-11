/// <reference lib="dom" />
import { Req } from '../helpers/req';
import { parse } from '../helpers/json';
import { pathJoin } from '../helpers/pathJoin';
import { getApiUrl } from './messages';
import { toErr } from '@common/helpers';

const initRealtime = () => {
  let clientId: string = '';
  let eventSource: EventSource | undefined = undefined;
  let xhr: XMLHttpRequest | undefined = undefined;
  let intervalId: any;
  let lastState = '';
  const subscriptions: Record<string, ((data: any) => void)[]> = {};
  const realtimeUrl = pathJoin(getApiUrl(), 'realtime');

  let lastHeartbeat = 0;
  const wrappedListeners: Record<string, (event: any) => void> = {};

  const isConnected = (): boolean =>
    !!eventSource &&
    !!clientId &&
    eventSource.readyState === EventSource.OPEN &&
    Date.now() - lastHeartbeat < 30000;

  const addAllListeners = (eventSource: EventSource) => {
    // console.debug('realtime addAllListeners', eventSource);

    // Remove old listeners first to prevent duplication
    for (const key in wrappedListeners) {
      eventSource.removeEventListener(key, wrappedListeners[key]);
      delete wrappedListeners[key];
    }

    // Add new listeners
    for (const key in subscriptions) {
      const listeners = subscriptions[key];
      if (listeners.length > 0) {
        wrappedListeners[key] = (event: any) => {
          lastHeartbeat = Date.now();
          listeners.forEach((listener) => listener(event));
        };
        eventSource.addEventListener(key, wrappedListeners[key]);
      }
    }
  };

  const disconnect = () => {
    console.debug('realtime disconnect');
    if (xhr) {
      xhr.abort();
      xhr = undefined;
    }
    if (eventSource) {
      // Clean up listeners before closing
      for (const key in wrappedListeners) {
        eventSource.removeEventListener(key, wrappedListeners[key]);
        delete wrappedListeners[key];
      }
      eventSource.close();
      eventSource = undefined;
    }
    clientId = '';
    lastHeartbeat = 0;
    lastState = '';
  };

  const connect = async () => {
    // console.debug('realtime connecting', realtimeUrl);
    disconnect();
    await new Promise<void>((resolve) => {
      eventSource = new EventSource(realtimeUrl);
      eventSource.addEventListener('PB_CONNECT', (e: MessageEvent) => {
        // console.debug('PB_CONNECT', e);
        if (!e) return console.warn('PB_CONNECT e');
        const id = (parse(e.data) || {}).clientId;
        if (!id) return console.warn('PB_CONNECT id');
        clientId = id;
        lastHeartbeat = Date.now();
        resolve();
      });
    });
    console.debug('realtime connected', clientId);
  };

  const update = async (req: Req) => {
    try {
      // console.debug('realtime update');
      clearInterval(intervalId);
      intervalId = setInterval(() => update(req), 10000);

      const state = (isConnected() ? 'ok' : 'ko') + Object.keys(subscriptions).join(',');
      if (state === lastState) return;
      lastState = state;

      const subscriptionKeys: string[] = [];
      for (const key in subscriptions) {
        if (!subscriptions[key].length) {
          delete subscriptions[key];
        } else {
          subscriptionKeys.push(key);
        }
      }
      console.debug('realtime update state', state);

      if (!subscriptionKeys.length) return disconnect();
      if (!isConnected()) await connect();

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
        },
      });

      xhr = undefined;
      if (eventSource) addAllListeners(eventSource);
    } catch (e) {
      const error = toErr(e);
      console.error('realtime update', error);
    }
  };

  return {
    subscriptions,
    update,
  };
};

export const realtime = initRealtime();
