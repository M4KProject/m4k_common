import { supabase } from './_generated';
import { supaPromise } from './helpers';
import { getFileName, MediaData, MediaInfo, medias$ } from './storage';

export const rpc = <T>(fn: string, args?: any): Promise<T> => supaPromise(fn, () => supabase.rpc(fn, args))

export const getMedias = async (path: string, limit = 9999, offset = 0) => (
    rpc<MediaInfo[]>('get_medias', { prefix: path, limit, offset })
        .then(data => (data || []).map(media => ({
            ...media,
            name: getFileName(media.path),
        })))
)

export const getMedia = (path: string) => getMedias(path, 1).then(m => m[0])

export interface UserEmail { id: string, email: string };
export const getEmails = async (userIds: string[]) => (
    userIds.length === 0 ? Promise.resolve([]) :
    rpc<UserEmail[]>('get_emails', { user_ids: userIds })
        .then(data => data || [])
);

type _Partial<T> = { [P in keyof T]?: T[P]|null; };
/**
 * Modifie les user_metadata du media
 * @param path 
 * @param changes une valeur null supprimera la propriété
 */
export const updateMediaData = async (path: string, changes: _Partial<MediaData>) => {
    medias$.next(prev => {
        const media = Object.values(prev).find(m => m.path === path);
        if (!media?.id) return prev;
        return { ...prev, [media.id]: { ...media, ...changes } };
    });
    return await rpc<void>('update_media_data', { path, changes })
};
