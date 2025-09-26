import { Auth, auth$ } from '@common/api/messages';
import { apiPost } from './call';
import { toError } from '@common/utils/cast';
import { getAuthHeaders } from './apiReq';

const COLL = 'users';

export const login = async (email: string, password: string, coll = COLL) => {
  try {
    console.debug('api login', coll, email);
    const result = await apiPost(`collections/${coll}/auth-with-password`, {
      form: { identity: email, password },
    });
    console.debug('api login result', result);
    if (!result.token) throw toError('no token');
    const auth: Auth = { ...result.record, token: result.token };
    auth$.set(auth);
    console.debug('api login auth', auth);
    return auth;
  } catch (error) {
    console.error('api login error', coll, email, error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, isLogin = true, coll = COLL) => {
  try {
    console.debug('api signUp', coll, email);
    const result = await apiPost(`collections/${coll}/records`, {
      form: { email, password, passwordConfirm: password },
    });
    console.debug('api signUp result', result);
    if (isLogin) {
      return await login(email, password, coll);
    }
    return result.record as Auth;
  } catch (error) {
    console.warn('api signUp error', error);
    throw error;
  }
};

export const logout = () => {
  console.debug('api logout');
  auth$.set(null);
};

export const passwordReset = async (email: string, coll = COLL) => {
  try {
    console.debug('api passwordReset', coll, email);
    const result = await apiPost(`collections/${coll}/request-password-reset`, {
      form: { email },
    });
    console.debug('api passwordReset result', result);
    return true;
  } catch (error) {
    console.warn('api passwordReset error', error);
    throw error;
  }
};

export const authRefresh = async (
  email: string,
  token: string,
  coll = COLL
): Promise<Auth | null> => {
  try {
    console.debug('api authRefresh', coll, email);
    const result = await apiPost(`collections/${coll}/auth-refresh`, {
      headers: getAuthHeaders(token),
    });
    console.debug('api authRefresh result', result);
    if (result.status === 401) {
      logout();
      throw toError(result.message);
    }
    if (!result.token) throw toError(result.message);
    const auth = { ...result.record, token: result.token };
    auth$.set(auth);
    return auth;
  } catch (error) {
    console.warn('api authRefresh error', error);
    throw error;
  }
};
