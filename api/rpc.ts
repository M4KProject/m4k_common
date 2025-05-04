import { by, toErr } from '@common/helpers';
import { supabase } from './_generated';
import { supaPromise } from './helpers';
import { MediaData, MediaInfo, medias$ } from './storage';

const _rpc = <T>(fn: string, args?: Record<string, any>): Promise<T> => supaPromise(fn,
    () => supabase.rpc(fn, args ? by(args, (_, k) => '_' + k) : null)
)

export const rpcServerTime = () => _rpc('server_time');

export const initBucket = async (id: string, name: string) => (
    _rpc('init_bucket', { id, name })
)

export const getMedias = (bucketId: string) => (
    _rpc<any[]>('get_medias', { bucket_id: bucketId })
        .then(medias => medias.map(m => Object.assign(m, { bucketId }) as MediaInfo))
)

// export const getMedia = (path: string) => getMedias(path, 1).then(m => m[0])

export interface UserEmail { id: string, email: string };
export const getEmails = (ids: string[]) => (
    ids?.length
        ? _rpc<UserEmail[]>('get_emails', { ids })
        : Promise.resolve([])
);

type _Partial<T> = { [P in keyof T]?: T[P]|null; };
/**
 * Modifie les user_metadata du media
 * @param name 
 * @param changes une valeur null supprimera la propriété
 */
export const updateMediaData = async (id: string, changes: _Partial<MediaData>) => {
    const media = medias$.v[id];
    if (!media) throw toErr('no-media');
    const mediaUpdated = { ...media, data: { ...media.data, ...changes } as MediaData };
    medias$.set({ ...medias$.v, [id]: mediaUpdated });
    return await _rpc<void>('update_media_data', { id, changes });
};
