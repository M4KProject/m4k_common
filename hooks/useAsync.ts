import { useMemo, useEffect } from "preact/hooks";
import { Msg } from "../helpers/Msg";
import { useMsg } from "./useMsg";

export const useAsync = <T>(initValue: T, load: () => T|Promise<T>, storedKey?: string|null, deps?: any[]): [T, () => void, Msg<T>] => {
    const _deps = deps ? [...deps, storedKey] : [storedKey];
    
    // import { isArray, isDefined } from "@common/helpers/check";
    // const msg = useMemo(() => {
    //     const msg = new Msg<T>(initValue, storedKey, !!storedKey);
    //     if (isDefined(initValue) && (typeof msg.v !== typeof initValue || isArray(msg.v) !== isArray(initValue))) {
    //         msg.set(initValue);
    //     }
    //     return msg;
    // }, _deps);

    const msg = useMemo(() => new Msg<T>(initValue, storedKey||undefined, !!storedKey), _deps);

    const reload = async () => {
        const value = await load();
        msg.set(value);
    }

    useEffect(() => {
        reload();
    }, _deps);

    const value = useMsg(msg);

    return [value, reload, msg];
}
