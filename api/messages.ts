import { toError } from '../utils/cast';
import { Msg } from '../utils/Msg';
import { isItem, isStr, isStrNotEmpty } from '../utils/check';
import { UserModel } from './models';

// export const PB_URL_DEV = "http://127.0.0.1:8090/api/";

export interface Auth extends UserModel {
  token: string;
}
export const auth$ = new Msg<Auth | null>(null, 'auth', true, isItem);

export const apiUrl$ = new Msg<string>('', 'apiUrl', true, isStr);

export const groupId$ = new Msg<string>('', 'groupId', true, isStr);

const defaultUrl = 'https://i.m4k.fr/api/'; // (location.port ? location.origin.replace(location.port, "8090") : location.origin) + "/api/";

export const getApiUrl = () => apiUrl$.v || defaultUrl;
export const getAuthId = () => auth$.v?.id || '';
export const getGroupId = () => groupId$.v;

export const needAuthId = () => {
  const id = getAuthId();
  if (!isStrNotEmpty(id)) throw toError('no auth id');
  return id;
};

export const needGroupId = () => {
  const id = getGroupId();
  if (!isStrNotEmpty(id)) throw toError('no group id');
  return id;
};
