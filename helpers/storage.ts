import { addItem, removeItem } from "./list";
import { throttle } from "./async";
import { isBool, isItem, isList, isNbr, isRealNbr, isStr } from "./check";
import { global } from "./global";

const newStorage = (): typeof localStorage => {
    const r = {
        _d: {} as Record<string, string>,
        _r: () => {
            r.length = Object.keys(r._d).length;
        },
        clear: () => {
            r._d = {};
            r._r();
        },
        getItem: (key: string) => r._d[key],
        setItem: (key: string, value: string) => {
            r._d[key] = value;
            r._r();
        },
        removeItem: (key: string) => {
            delete r._d[key];
            r._r();
        },
        key: (index: number) => Object.keys(r._d)[index],
        length: 0,
    };
    return r;
}

export const storage: typeof localStorage = global.localStorage || (global.localStorage = newStorage());

let prefix = "m4k_";

const _listeners = [];
const _signal = throttle<undefined>(() => {
    for (const listener of _listeners) {
        listener();
    }
}, 10) as () => void;

export const onStored = (cb: () => void) => {
    addItem(_listeners, cb);
    return () => removeItem(_listeners, cb)
}

export const setStoragePrefix = (value: string) => {
    const data = getStoredData();
    prefix = value;
    updateStoredData(data);
}

export const getStoragePrefix = () => prefix;

export const getStored = <T = any, U = T>(key: string, initValue?: U, check?: (value: T) => boolean): T|U => {
    try {
        const json = storage.getItem(prefix + key);
        let value = json ? JSON.parse(json) : undefined;
        if (!check) {
            check =
                isStr(initValue) ? isStr :
                isNbr(initValue) ? isNbr :
                isBool(initValue) ? isBool :
                isList(initValue) ? isList :
                isItem(initValue) ? isItem :
                () => true
        }
        if (value !== undefined && !check(value)) {
            throw 'check error';
        }
        return value !== undefined ? value : initValue;
    }
    catch (error) {
        console.error('getStored error', key, error);
        return initValue;
    }
}

export const setStored = <T = any>(key: string, value?: T): void => {
    try {
        if (value === undefined) {
            storage.removeItem(prefix + key);
            return;
        }

        const json = JSON.stringify(value);
        if (json === undefined) {
            console.error('setStored', key, value);
            return;
        }

        storage.setItem(prefix + key, json);
        _signal();
    }
    catch (error) {
        console.error('setStored error', key, value, error);
    }
}

export const getStoredKeys = (): string[] => {
    const keys = [];
    for (let i=0,l=storage.length;i<l;i++) {
        const fullKey = storage.key(i);
        if (fullKey.startsWith(prefix)) {
            keys.push(fullKey.slice(prefix.length));
        }
    }
    return keys;
}

export const getStoredData = (): Record<string, any> => {
    const keys = getStoredKeys();
    const result = {} as Record<string, any>;
    for (const key of keys) {
        result[key] = getStored(key);
    }
    return result;
}

export const clearStoredData = (): void => {
    const keys = getStoredKeys();
    for (const key of keys) {
        setStored(key, undefined);
    }
    _signal();
}

export const updateStoredData = (data: Record<string, any>) => {
    for (const key in data) {
        setStored(key, data[key]);
    }
    _signal();
}

export const replaceStoredData = (data: Record<string, any>) => {
    clearStoredData();
    updateStoredData(data);
}