import { supabase } from "./_generated";

export type SPromise<T, E> = PromiseLike<{ data?: T|null, error?: E|null; }>;

export interface SupaPromise {
    <T=any, E=any>(name: string, sPromise: ((s: typeof supabase) => SPromise<T, E>), onNull: () => T): Promise<T>;
    <T=any, E=any>(name: string, sPromise: ((s: typeof supabase) => SPromise<T, E>)): Promise<T|null>;
}

export const supa: SupaPromise = <T=any, E=any>(name: string, sPromise: ((s: typeof supabase) => SPromise<T, E>), onNull?: () => T) => (
    new Promise<T|null|undefined>((resolve, reject) => {
        console.debug(name, 'starting');
        (typeof sPromise === 'function' ? sPromise(supabase) : sPromise).then(
            ({ data, error }) => {
                try {
                    if (error) throw error;
                    if (onNull && (data === null || data === undefined)) data = onNull();
                    console.debug(name, 'success', data);
                    resolve(data);
                } catch (error) {
                    console.warn(name, 'failure', error);
                    reject(error);
                }
            }
        )
    })
);


//     (typeof sPromise === 'function' ? sPromise() : sPromise).then(
//         ({ data, error })

//     try {
//         console.debug('storage', name);
//         const { data, error } = await promiseLike;
//         if (error) throw error;
//         console.debug('storage', name, 'result', data);
//         return data;
//     }
//     catch (error) {
//         console.warn('storage', name, 'error', error);
//         throw error;
//     }
// }
