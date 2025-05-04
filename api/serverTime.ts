import { toErr } from '../helpers/err';
import { rpcServerTime } from './rpc';

export const getTime = (value: any) => {
    if (!value || (typeof value !== 'string' && typeof value !== 'number'))
        throw toErr('cast time error', value);
    return new Date(value).getTime();
}

let _serverTimeSync: number|null = null;

export const resetServerTimeSync = async () => {
    const start = Date.now();
    const remote = await rpcServerTime().then(getTime);
    const local = (start + Date.now()) / 2;
    _serverTimeSync = remote - local;
}

export const serverTimeReady = resetServerTimeSync();

export const getServerTime = () => {
    return Date.now() + (_serverTimeSync || 0);
}
