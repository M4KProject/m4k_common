import { TMap } from "./types";

interface Logger {
    d: (...args: any[]) => void;
    i: (...args: any[]) => void;
    w: (...args: any[]) => void;
    e: (...args: any[]) => void;
}

const cache: TMap<Logger> = {};

let _log = (tag: string, level: string, args: any[]) => {
    (console as any)[level](tag, ...args);
}

export const setLog = (next: typeof _log) => _log = next;

const newLogger = (tag: string): Logger => {
    const TAG = tag ? `[${tag}] ` : '';
    return {
        d: (...args: any[]) => _log(tag, 'debug', args),
        i: (...args: any[]) => _log(tag, 'info', args),
        w: (...args: any[]) => _log(tag, 'warn', args),
        e: (...args: any[]) => _log(tag, 'error', args),
    }
}

export const logger = (tag: string) => cache[tag] || (cache[tag] = newLogger(tag));

const base = logger('');
export const debug = base.d;
export const info = base.i;
export const warn = base.w;
export const error = base.e;