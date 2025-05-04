import { toVoid } from "@common/helpers/cast";
import { useEffect, useState } from "react";

export interface IPromise<T> {
    then: (cb: (value: T) => any) => any;
    catch?: (cb: (reason: any) => any) => any;
}

const _refresh = <T>(
    constructor: () => IPromise<T>|null|undefined,
    setResult: React.Dispatch<React.SetStateAction<[T | undefined, any, boolean, () => void]>>
) => {
    let isMounted = true;

    const refresh = () => {
        isMounted = false;
        _refresh(constructor, setResult);
    }

    // Init loading
    setResult([undefined, undefined, true, refresh]);

    const promise = constructor();
    if (promise) {
        promise.then(value => {
            if (isMounted) setResult([value, undefined, false, refresh])
        })
        if (promise.catch) {
            promise.catch(error => {
                if (isMounted) setResult([undefined, error, false, refresh])
            })
        }
    }

    return () => {
        isMounted = false;
    };
}

/**
 * Custom hook to handle promise-based operations with loading and error states
 * @param constructor A function that returns a Promise, null, or undefined
 * @param deps Dependency array that triggers re-execution of the promise
 * @returns [value, error, isLoading, refresh] - Tuple containing result value, error state, and loading indicator
 */
export const usePromise = <T>(
    constructor: () => IPromise<T>|null|undefined,
    deps: React.DependencyList
): [T|undefined, any, boolean, () => void] => {
    const [result, setResult] = useState<[T|undefined, any, boolean, () => void]>([undefined, undefined, true, toVoid])
    useEffect(() => _refresh(constructor, setResult), deps) // eslint-disable-line react-hooks/exhaustive-deps
    return result
}

export default usePromise;