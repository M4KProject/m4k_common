import { apiPost } from './call';
import { toError } from '@common/utils/cast';
import { ApiAuth, apiAuth$, getAuthHeaders } from './apiReq';

const AUTH_COLL = 'users';

export const authLogin = async (email: string, password: string, coll = AUTH_COLL) => {
  try {
    console.debug('api login', email, coll);
    const result = await apiPost(`collections/${coll}/auth-with-password`, {
      form: { identity: email, password },
    });
    console.debug('api login result', result);
    if (!result.token) throw toError('no token');
    const auth: ApiAuth = { ...result.record, token: result.token };
    apiAuth$.set(auth);
    console.debug('api login auth', auth);
    return auth;
  } catch (error) {
    console.error('api login error', coll, email, error);
    throw error;
  }
};

export const authSignUp = async (
  email: string,
  password: string,
  isLogin = true,
  coll = AUTH_COLL
) => {
  try {
    console.debug('api signUp', email, isLogin, coll);
    const result = await apiPost(`collections/${coll}/records`, {
      form: { email, password, passwordConfirm: password },
    });
    console.debug('api signUp result', result);
    if (isLogin) {
      return await authLogin(email, password, coll);
    }
    return result.record as ApiAuth;
  } catch (error) {
    console.warn('api signUp error', error);
    throw error;
  }
};

export const authLogout = () => {
  console.debug('api logout');
  apiAuth$.set(null);
};

export const authPasswordReset = async (email: string, coll = AUTH_COLL) => {
  try {
    console.debug('api passwordReset', email, coll);
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
  token?: string,
  coll = AUTH_COLL
): Promise<ApiAuth | null> => {
  try {
    if (!token) token = apiAuth$.v?.token;
    console.debug('api authRefresh', token, coll);
    const result = await apiPost(`collections/${coll}/auth-refresh`, {
      headers: getAuthHeaders(token),
    });
    console.debug('api authRefresh result', result);
    if (result.status === 401) {
      authLogout();
      throw toError(result.message);
    }
    if (!result.token) throw toError(result.message);
    const auth = { ...result.record, token: result.token };
    apiAuth$.set(auth);
    return auth;
  } catch (error) {
    console.warn('api authRefresh error', error);
    throw error;
  }
};
