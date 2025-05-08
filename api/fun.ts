import { by } from "@common/helpers/by";
import { toStr } from "@common/helpers/cast";
import { SUPABASE_URL } from "./_generated";
import { auth$ } from "./auth";

type Params = Record<string, any>
type Options = RequestInit & {
    params?: Params;
    json?: any;
}

const _req = async (method: 'GET'|'POST'|'PUT', service: string, { params, json, ...o }: Options = {}) => {
    console.debug('fun.req', method, service, o);
    const token = auth$.v?.access_token;
    const search = params ? `?${new URLSearchParams(params)}` : '';
    const response = await fetch(`${SUPABASE_URL}/fun/${service}${search}`, {
        method,
        ...o,
        ...(json ? { body: JSON.stringify(json) } : {}),
        headers: {
            ...o.headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
    const result = await response.json();
    console.debug('fun.req', method, service, o, 'response', response.status, result);
    return result;
}

const _get = (service: string, params?: Params, options: Options = {}) =>
    _req('GET', service, { ...options, params });

const _put = (service: string, json?: any, options: Options = {}) =>
    _req('PUT', service, { ...options, json });

export const fun = {
    req: _req,
    get: _get,
    put: _put,
}