import { throwIf } from "../helpers/err";
import { Msg } from "../helpers/Msg";
import { isEmpty, isObject, isString } from "../helpers/check";
import { toDate } from "../helpers/cast";
import { UserModel } from "./models";

// export const PB_URL_DEV = "http://127.0.0.1:8090/api/";

export interface Auth extends UserModel { token: string; }
export const auth$ = new Msg<Auth | null>(null, "auth", true, isObject);

export const apiUrl$ = new Msg<string>("", "apiUrl", true, isString);

export const timeOffset$ = new Msg(0, "timeOffset", true);
export const getTimeOffset = timeOffset$.getter();
export const getApiTime = () => getTimeOffset() + Date.now();
export const apiNow = () => new Date(getApiTime()).toISOString();

export const toTime = (date: any) => toDate(date).getTime();

export const groupId$ = new Msg<string>("", "groupId", true, isString);

const defaultUrl = "https://i.m4k.fr/api/";// (location.port ? location.origin.replace(location.port, "8090") : location.origin) + "/api/";

export const getApiUrl = () => apiUrl$.v || defaultUrl;
export const getAuthId = () => auth$.v?.id || "";
export const getGroupId = () => groupId$.v;

export const needAuthId = () => throwIf(getAuthId(), isEmpty, "no auth id");
export const needGroupId = () => throwIf(getGroupId(), isEmpty, "no group id");
