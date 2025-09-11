import { ReqMethod, ReqOptions } from '../helpers/req';
import { apiReq } from './Coll';

export const apiCall = (method: ReqMethod, url: string, options?: ReqOptions<any>) => (
  apiReq('')(method, url, options)
)
export const apiGet = (url: string, options?: ReqOptions<any>) => apiCall('GET', url, options);
export const apiPost = (url: string, options?: ReqOptions<any>) => apiCall('POST', url, options);
