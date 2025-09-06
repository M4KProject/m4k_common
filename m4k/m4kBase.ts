import { toErr } from '../helpers/err';
import { M4Kiosk } from './m4kInterface';
import { m4kMethods } from './m4kMethods';
import { global } from '../helpers/global';
import { isFun } from '../helpers';

type MethodAsyncOrSync<T> = T extends (...args: infer A) => Promise<infer R>
  ? (...args: A) => Promise<R> | R
  : T;

type MethodsAsyncOrSync<T> = {
  [P in keyof T]?: MethodAsyncOrSync<T[P]>;
};

export const m4kBase = (m4k: M4Kiosk, methods: MethodsAsyncOrSync<M4Kiosk> = {}) => {
  const m = m4k as any;

  if (!methods.js) {
    methods.js = async (script: string) => {
      try {
        console.debug('eval', script);
        let result = await m4k.global.eval(script);
        if (isFun(result)) result = await result(m4k);
        return { success: true, value: result };
      } catch (e) {
        return { success: false, error: String(toErr(e)) };
      }
    };
  }

  if (!methods.reload) {
    methods.reload = () => location.reload();
  }

  if (!methods.restart) {
    methods.restart = () => location.reload();
  }

  if (!methods.info) {
    methods.info = () => ({
      type: 'browser',
      width: screen.width,
      height: screen.height,
    });
  }

  // bind methods
  for (const name in m4kMethods) {
    const cb = methods[name];
    m4k[name] = async (...args: any[]) => {
      const canLog = name !== 'log';
      if (!cb) {
        canLog && console.warn('m4k', name, 'not implemented', args);
        return null;
      }
      try {
        canLog && console.debug('m4k', name, 'start', args);
        const result = await cb(...args);
        canLog && console.debug('m4k', name, 'result', args, result);
        return result;
      } catch (e) {
        const error = toErr(e);
        canLog && console.error('m4k', name, 'error', args, error);
        throw error;
      }
    };
  }

  m4k.global = global;

  // // sync storage
  // (async () => {
  //     onStored(() => {
  //         const data = getStoredData();
  //         const json = stringify(data);
  //         m4k.setStorage(json);
  //     });
  //     const json = await m4k.getStorage();
  //     const data = parse(json);
  //     if (data) replaceStoredData(data);
  // })();
};
