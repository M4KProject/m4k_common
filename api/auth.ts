import { toErr } from '../helpers/err';
import { getParams, CollOptions } from './Coll';
import { userColl } from './collections';
import { auth$ } from './messages';
import { UserModel } from './models';

let _authColl = userColl;

export const setAuthColl = (coll: typeof userColl) => {
  _authColl = coll;
};

export const login = (
  identity: string,
  password: string,
  o?: CollOptions<UserModel>
): Promise<UserModel> =>
  _authColl
    .r<{ token: string; record: UserModel }>('POST', `auth-with-password`, {
      params: getParams(o),
      form: { identity, password },
      after: (ctx) => {
        if (!ctx.data.token) {
          ctx.error = 'no token';
          return;
        }
      },
    })
    .then((result) => {
      console.debug('login result', result);
      auth$.set({ ...result.record, token: result.token });
      return result.record;
    });

export const signUp = async (email: string, password: string, isLogin = true) => {
  try {
    console.debug('signUp email', email);
    const user = await _authColl.create(
      {
        email,
        password,
        passwordConfirm: password,
      },
      { select: ['id'] }
    );
    console.debug('signUp user', user);
    if (isLogin) await login(email, password);
    return user;
  } catch (error) {
    console.warn('signUp error', toErr(error));
  }
};

export const logout = () => auth$.set(null);

export const passwordReset = (email: string, o?: CollOptions<UserModel>) =>
  _authColl
    .r('POST', `request-password-reset`, {
      params: getParams(o),
      form: { email },
    })
    .then((result) => {
      console.debug('password reset', result);
      return true;
    });

export const authRefresh = (): Promise<UserModel | null> =>
  auth$.v
    ? _authColl
        .r('POST', `auth-refresh`, {})
        .then((result) => {
          console.debug('authRefresh result', result);
          if (result.status === 401) {
            logout();
            throw toErr(result.message);
          }
          if (!result.token) throw toErr(result.message);
          auth$.set({ ...result.record, token: result.token });
          return auth$.v;
        })
        .catch((error) => {
          console.warn('authRefresh error', toErr(error));
          throw error;
        })
    : Promise.resolve(null);
