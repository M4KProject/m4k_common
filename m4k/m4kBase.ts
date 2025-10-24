import { toError } from '@common/utils/cast';
import { M4Kiosk } from './m4kInterface';
import { m4kMethods } from './m4kMethods';
import { app, appGlobal } from '@common/utils/app';
import { isFun } from '@common/utils/check';

type MethodAsyncOrSync<T> =
  T extends (...args: infer A) => Promise<infer R> ? (...args: A) => Promise<R> | R : T;

type MethodsAsyncOrSync<T> = {
  [P in keyof T]?: MethodAsyncOrSync<T[P]>;
};

export const m4kBase = (m4k: M4Kiosk, methods: MethodsAsyncOrSync<M4Kiosk> = {}) => {
  const m = m4k as any;

  if (!methods.evalJs) {
    methods.evalJs = async (script: string) => {
      try {
        console.debug('eval', script);
        let result = await appGlobal.eval(script);
        if (isFun(result)) result = await result(m4k);
        return { success: true, value: result };
      } catch (e) {
        return { success: false, error: String(toError(e)) };
      }
    };
  }

  if (!methods.reload) {
    methods.reload = () => location.reload();
  }

  if (!methods.restart) {
    methods.restart = () => location.reload();
  }

  if (!methods.deviceInfo) {
    methods.deviceInfo = () => ({
      type: 'browser',
      width: screen.width,
      height: screen.height,
    });
  }

  // bind methods
  for (const name in m4kMethods) {
    const cb = methods[name as keyof M4Kiosk];
    m4k[name as keyof M4Kiosk] = async (...args: any[]) => {
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
        const error = toError(e);
        canLog && console.error('m4k', name, 'error', args, error);
        throw error;
      }
    };
  }

  m4k.app = app;
  m4k.global = appGlobal;

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
