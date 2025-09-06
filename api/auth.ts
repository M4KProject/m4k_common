import { toErr } from "../helpers/err";
import { getParams, CollOptions } from "./Coll";
import { userColl } from "./collections";
import { auth$ } from "./messages";
import { UserModel } from "./models";

export const login = (
  identity: string,
  password: string,
  o?: CollOptions<UserModel>,
): Promise<UserModel> => (
  userColl.r("POST", `auth-with-password`, {
    params: getParams(o),
    form: { identity, password },
  }).then((result) => {
    console.debug("login result", result);
    if (!result.token) throw toErr(result.message, result);
    auth$.set({ ...result.record, token: result.token });
    return result.record;
  })
);

export const signUp = async (email: string, password: string) => {
  try {
    console.debug("signUp email", email);
    const user = await userColl.create({
      email,
      password,
      passwordConfirm: password,
    }, { select: ["id"] });
    console.debug("signUp user", user);
    await login(email, password);
    return user;
  } catch (error) {
    console.warn("signUp error", error);
  }
};

export const logout = () => auth$.set(null);

export const passwordReset = (email: string, o?: CollOptions<UserModel>) => (
  userColl.r("POST", `request-password-reset`, {
    params: getParams(o),
    form: { email },
  }).then((result) => {
    console.debug("password reset", result);
    return true;
  })
);

export const authRefresh = (): Promise<UserModel|null> => (
  auth$.v ? userColl.r("POST", `auth-refresh`, {}).then((result) => {
    console.debug("authRefresh result", result);
    if (result.status === 401) {
      logout();
      throw toErr(result.message);
    }
    if (!result.token) throw toErr(result.message);
    auth$.set({ ...result.record, token: result.token });
    return auth$.v;
  }).catch((error) => {
    console.warn("authRefresh error", error);
    throw error;
  }) : Promise.resolve(null)
);