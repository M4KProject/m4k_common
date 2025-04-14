import { supabase } from './_generated';
import { getFileName, MediaInfo } from './storage';

export const getMedias = async (groupId: string) => {
    try {
        console.debug('getMedias', groupId);
        const { data, error } = await supabase.rpc('get_medias', { group_id: groupId });
        console.debug('getMedias result', groupId, data, error);
        if (error) throw error;
        return (data as MediaInfo[]).map(media => ({
            ...media,
            name: getFileName(media.path),
        }));
    }
    catch (error) {
        console.warn('getMedias', groupId, error);
        throw error;
    }
}

export interface UserEmail { id: string, email: string };
export const getEmails = async (userIds: string[]) => {
    try {
        console.debug('getEmails', userIds);
        if (userIds.length === 0) return [];
        const { data, error } = await supabase.rpc('get_emails', { user_ids: userIds });
        console.debug('getEmails result', userIds, data, error);
        if (error) throw error;
        return data as UserEmail[];
    }
    catch (error) {
        console.warn('getEmails', userIds, error);
        throw error;
    }
}
