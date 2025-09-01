import { parse, stringify } from "@common/helpers/json";
import { toErr } from "../helpers/err";
import { M4Kiosk } from "./m4kInterface";
import { getStoredData, onStored, replaceStoredData } from "@common/helpers/storage";
import { m4kMethods } from "./m4kMethods";

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
                const result = await m4k.global.eval(script);
                return { success: true, value: result };
            }
            catch (e) {
                return { success: false, error: String(toErr(e)) };
            }
        }
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
            }
            catch (error) {
                canLog && console.error('m4k', name, 'error', args, error);
                throw error;
            }
        };
    }

    // sync storage
    (async () => {
        onStored(() => {
            const data = getStoredData();
            const json = stringify(data);
            m4k.setStorage(json);
        });
        
        const json = await m4k.getStorage();
        const data = parse(json);
        if (data) replaceStoredData(data);
    })();
};