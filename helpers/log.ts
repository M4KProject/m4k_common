import { isDate, isErr, isObj } from "./check";
import { toErr } from "./err";
import { stringify } from "./json";

export const logArgToStr = (a: any) => (
    isErr(a) ? toErr(a).toString() :
    isDate(a) ? a.toISOString() :
    isObj(a) ? stringify(a) :
    String(a)
);

export const logArgsToStr = (args: any[]) => (
    args.map(logArgToStr).join(' ')
);