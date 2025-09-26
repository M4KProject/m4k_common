import { Msg } from '@common/utils';
import { pathJoin } from '../utils/pathJoin';
import { createReq, Req, ReqError, ReqOptions } from '../utils/req';
import { auth$, getApiUrl } from './messages';

export const apiError$ = new Msg<ReqError<any>>(null);

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'X-Auth-Token': token, // For Android WebView
});

export const newApiReq = (baseUrl: string = '', baseOptions: ReqOptions<any> = {}) =>
  createReq({
    baseUrl: pathJoin(getApiUrl(), baseUrl),
    timeout: 10000,
    // log: true,
    ...baseOptions,
    base: (o) => {
      o.onError = apiError$.setter();

      const auth = auth$.v;
      if (auth) {
        o.headers = {
          ...getAuthHeaders(auth.token),
          ...o.headers,
        };
      }
    },
  });

let _apiReq: Req;
export const getApiReq = () => _apiReq || (_apiReq = newApiReq());
