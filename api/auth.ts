import { toErr } from "@common/helpers/err.ts";
import { getParams, CollOptions } from "./Coll.ts";
import { userColl } from "./collections.ts";
import { auth$ } from "./messages.ts";
import { UserModel } from "./models.ts";

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
    if (!result.token) throw toErr(result.message);
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
