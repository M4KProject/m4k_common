import { useEffect, useState } from "react";

export interface IPromise<T> {
    then: (cb: (value: T) => any) => any;
    catch?: (cb: (reason: any) => any) => any;
}

/**
 * Custom hook to handle promise-based operations with loading and error states
 * @param constructor A function that returns a Promise, null, or undefined
 * @param deps Dependency array that triggers re-execution of the promise
 * @returns [value, error, isLoading] - Tuple containing result value, error state, and loading indicator
 */
const usePromise = <T>(
    constructor: () => IPromise<T>|null|undefined,
    deps: React.DependencyList
): [T|undefined, any, boolean] => {
    const [result, setResult] = useState<[T|undefined, any, boolean]>([undefined, undefined, true])
    useEffect(() => {
        let isMounted = true;
        setResult([undefined, undefined, true])
        const promise = constructor();
        if (promise) {
            promise.then(value => {
                if (isMounted) setResult([value, undefined, false])
            })
            if (promise.catch) {
                promise.catch(error => {
                    if (isMounted) setResult([undefined, error, false])
                })
            }
        }
        return () => {
            isMounted = false;
        };
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
    return result
}

export default usePromise;