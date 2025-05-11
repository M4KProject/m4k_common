import { SUPABASE_URL } from "./_generated";
import { auth$ } from "./auth";

type Params = Record<string, any>
type Options = RequestInit & {
    params?: Params;
    data?: any;
}

const _req = async <T>(method: 'GET'|'POST'|'PUT'|'DELETE', path: string, { params, data, ...o }: Options = {}) => {
    console.debug('fun.req', method, path, o);
    const token = auth$.v?.access_token;
    const search = params ? `?${new URLSearchParams(params)}` : '';
    const response = await fetch(`${SUPABASE_URL}/fun/${path}${search}`, {
        method,
        body: (
            data instanceof File ? data :
            typeof data === 'object' ? JSON.stringify(data) :
            data
        ),
        ...o,
        headers: {
            ...o.headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
    const result = await response.json();
    console.debug('fun.req', method, path, o, 'response', response.status, result);
    return result as T;
}

const _get = <T>(path: string, params?: Params, options: Options = {}) =>
    _req<T>('GET', path, { ...options, params });

const _put = <T>(path: string, data?: any, options: Options = {}) =>
    _req<T>('PUT', path, { ...options, data });

const _delete = <T>(path: string, data?: any, options: Options = {}) =>
    _req<T>('DELETE', path, { ...options, data });

export interface FileInfo {
    id: string,
    created: string,
    modified: string,
    name: string,
    hash: string,
    size: number,
    isDir: boolean,
}

export const getFiles = (path: string) => _get<FileInfo[]>(`files/${path}`);
export const uploadFile = (path: string, file: string|File) => _put(`file/${path}`, file);
export const deleteFile = (path: string) => _delete(`file/${path}`);

export const fun = {
    req: _req,
    get: _get,
    put: _put,
    delete: _delete,
    getFiles,
}