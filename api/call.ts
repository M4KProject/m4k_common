import { pathJoin } from '../helpers/pathJoin';
import { createReq, Req, ReqMethod, ReqOptions } from '../helpers/req';
import { auth$, getApiUrl } from './messages';

export const newApiReq = (baseUrl: string = '', baseOptions: ReqOptions<any> = {}) =>
  createReq({
    baseUrl: pathJoin(getApiUrl(), baseUrl),
    timeout: 10000,
    // log: true,
    ...baseOptions,
    base: (o) => {
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
