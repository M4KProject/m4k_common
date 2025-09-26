import { ReqMethod, ReqOptions } from '../utils/req';
import { getApiReq } from './apiReq';

export const apiCall = (method: ReqMethod, url: string, options?: ReqOptions<any>) =>
  getApiReq()(method, url, options);

export const apiGet = (url: string, options?: ReqOptions<any>) => apiCall('GET', url, options);

export const apiPost = (url: string, options?: ReqOptions<any>) => apiCall('POST', url, options);
