import { getParams, RepoOptions } from "./Coll";
import { userColl } from "./collections";
import { auth$ } from "./messages";
import { UserModel } from "./models";

export const login = (
  identity: string,
  password: string,
  o?: RepoOptions<UserModel>,
): Promise<UserModel> => (
  userColl.r("POST", `auth-with-password`, {
    params: getParams(o),
    form: { identity, password },
  }).then((result) => {
    console.debug("login result", result);
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

export const passwordReset = (email: string, o?: RepoOptions<UserModel>) => (
  userColl.r("POST", `request-password-reset`, {
    params: getParams(o),
    form: { email },
  }).then((result) => {
    console.debug("password reset", result);
    return true;
  })
);
