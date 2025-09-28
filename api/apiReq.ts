import { Msg } from '@common/utils/Msg';
import { pathJoin } from '../utils/pathJoin';
import { createReq, Req, ReqError, ReqMethod, ReqOptions } from '../utils/req';
import { isItem, isStr,isStrDef } from '@common/utils/check';
import { toError } from '@common/utils/cast';

export const apiError$ = new Msg<ReqError<any>>(null);

export interface ApiAuth {
  id: string;
  email: string;
  verified?: boolean;
  name?: string;
  avatar?: File | Blob | string;
  token: string;
}

export const apiAuth$ = new Msg<ApiAuth | null>(null, 'auth', true, isItem);

export const apiUrl$ = new Msg<string>('', 'apiUrl', true, isStr);

const defaultUrl = 'https://i.m4k.fr/api/'; // (location.port ? location.origin.replace(location.port, "8090") : location.origin) + "/api/";

export const setApiUrl = (next: string) => apiUrl$.set(next);

export const getApiUrl = () => apiUrl$.v || defaultUrl;

export const getAuthId = () => apiAuth$.v?.id || '';

export const needAuthId = () => {
  const id = getAuthId();
  if (!isStrDef(id)) throw toError('no auth id');
  return id;
};

export const getAuthHeaders = (token: string) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
        'X-Auth-Token': token, // For Android WebView
      }
    : {};

export const newApiReq = (baseUrl: string = '', baseOptions: ReqOptions<any> = {}) =>
  createReq({
    baseUrl: pathJoin(getApiUrl(), baseUrl),
    timeout: 10000,
    // log: true,
    ...baseOptions,
    base: (o) => {
      o.onError = apiError$.setter();

      const token = apiAuth$.v?.token;
      if (token) {
        o.headers = {
          ...getAuthHeaders(token),
          ...o.headers,
        };
      }
    },
  });

let _apiReq: Req;
export const getApiReq = () => _apiReq || (_apiReq = newApiReq());

export const apiReq = (method: ReqMethod, url: string, options?: ReqOptions<any>) =>
  getApiReq()(method, url, options);
