import { Msg } from '@common/utils';
import { pathJoin } from '../utils/pathJoin';
import { createReq, Req, ReqError, ReqMethod, ReqOptions } from '../utils/req';
import { auth$, getApiUrl } from './messages';

export const apiError$ = new Msg<ReqError<any>>(null);

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
          Authorization: `Bearer ${auth.token}`,
          'X-Auth-Token': auth.token, // For Android WebView
          ...o.headers,
        };
      }
    },
  });

let _apiReq: Req;
export const getApiReq = () => _apiReq || (_apiReq = newApiReq());

export const apiCall = (method: ReqMethod, url: string, options?: ReqOptions<any>) =>
  getApiReq()(method, url, options);
export const apiGet = (url: string, options?: ReqOptions<any>) => apiCall('GET', url, options);
export const apiPost = (url: string, options?: ReqOptions<any>) => apiCall('POST', url, options);
