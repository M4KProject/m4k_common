import { SUPABASE_URL } from "./_generated";
import { auth$ } from "./auth";

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';

export type ReqMethod = 'GET'|'POST'|'PUT'|'DELETE';
export type ReqParams = Record<string, any>
export type ReqOptions = RequestInit & {
    params?: ReqParams;
    data?: any;
}

const _req = async <T>(method: ReqMethod, path: string, params: ReqParams = {}, data: any = null, options: ReqOptions = {}) => {
    console.debug('fun.req', { method, path, params, data, options });
    const token = auth$.v?.access_token;
    const search = params ? `?${new URLSearchParams(params)}` : '';
    const response = await fetch(`${SUPABASE_URL}/fun/${path}${search}`, {
        method,
        body: (
            data instanceof File ? data :
            typeof data === 'object' ? JSON.stringify(data) :
            data
        ),
        ...options,
        headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
    const result = await response.json();
    console.debug('fun.req', { method, path, params, data, options, response, result });
    return result as T;
}

const _get = <T>(path: string, params?: ReqParams, options: ReqOptions = {}) =>
    _req<T>(GET, path, params, null, options);

const _post = <T>(path: string, params?: ReqParams, data?: any, options: ReqOptions = {}) =>
    _req<T>(POST, path, params, data, options);

const _put = <T>(path: string, params?: ReqParams, data?: any, options: ReqOptions = {}) =>
    _req<T>(PUT, path, params, data, options);

const _delete = <T>(path: string, params?: ReqParams, data?: any, options: ReqOptions = {}) =>
    _req<T>(DELETE, path, params, data, options);

// export interface FileInfo {
//     id: string,
//     created: string,
//     modified: string,
//     name: string,
//     hash: string,
//     size: number,
//     isDir: boolean,
// }

// export const getFiles = (path: string) => _get<FileInfo[]>(`files/${path}`);
// export const uploadFile = (path: string, file: string|File) => _put(`file/${path}`, file);
// export const deleteFile = (path: string) => _delete(`file/${path}`);

interface FilesResult {

}

export const _files = <T>(
    action: string,
    params: ReqParams = {},
    data: any = null,
    options: ReqOptions = {},
) => async (groupId: string, fileId: string) => {
    const job = await _req<T>(GET, `groups/${groupId}/${action}/${fileId}`, params, data, options);
};

export interface FileInfo {
    id: string,
    created: string,
    modified: string,
    name: string,
    hash: string,
    size: number,
    isDir: boolean,
}

export interface JobInfo {
    id: string,
    created: string,
    modified: string,
    name: string,
    hash: string,
    size: number,
    isDir: boolean,
}

// export const listFiles = _files<FileInfo[]>('list');
// export const unzipFile = _files<FileInfo[]>('unzip');
// export const getFileUrl = (groupId: string, fileId: string, format: 'source'|'hd'|'hd.jpg') => _get<FileInfo[]>(`files/${groupId}/${fileId}__${format}`);
// export const addFolder = (groupId: string, fileId: string) => _get<FileInfo[]>(`files/${groupId}/${fileId}`, { folder: 1 });
// export const uploadFile = (groupId: string, fileId: string, file: string|File) => _put<FileInfo[]>(`files/${groupId}/${fileId}`, file);

export const fun = {
    req: _req,
    get: _get,
    post: _post,
    put: _put,
    delete: _delete,
}