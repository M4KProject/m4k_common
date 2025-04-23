import { supabase } from "./_generated";
import { sort } from "@common/helpers/array";
import { supaPromise } from "./helpers";
import { groupId$ } from "./repos";
import Msg from "@common/helpers/Msg";
import { isAuth$ } from "./auth";
import { getMedias } from "./rpc";
import { deleteKey, valueBy } from "@common/helpers";

export type Storage = (typeof supabase)['storage'];
export type StorageFrom = ReturnType<Storage['from']>;
export type FileOptions = NonNullable<Parameters<StorageFrom['upload']>['2']>;
export type SearchOptions = NonNullable<Parameters<StorageFrom['list']>['1']>;
export type FetchParameters = NonNullable<Parameters<StorageFrom['list']>['2']>;
export type TransformOptions = NonNullable<NonNullable<Parameters<StorageFrom['download']>['1']>['transform']>;
export type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => PromiseLike<infer U> ? U : never;
export interface FileMetadata {
    cacheControl: string, // "max-age=3600",
    contentLength: number, // 1391119
    eTag: string, // "\"f4612a9fbd09235f0be65f81e9f40430\""
    httpStatusCode: 200,
    lastModified: string, // "2025-04-12T12:46:03.000Z"
    mimetype: string, // "application/pdf"
    size: number, // 1391119
};
export type FileObject = NonNullable<AsyncReturnType<StorageFrom['list']>['data']>[number] & {
    metadata: FileMetadata;
};
export type StorageError = NonNullable<AsyncReturnType<StorageFrom['list']>['error']>;
// export type FileObject = (Parameters<ReturnType<StorageFrom['list']>['then']>['0'] & {});

export const from = (bucket: string) => supabase.storage.from(bucket);

// export const uploadFile = async (bucket: string, path: string, file: File, options: FileOptions = {}) => {
//     try {
//         console.debug('uploadFile', bucket, path, file, options);
//         const { data, error } = await from(bucket).upload(path, file, {
//             cacheControl: '3600',
//             upsert: true,
//             ...options,
//         });
//         if (error) throw error;
//         console.debug('uploadFile', data);
//         return data;
//     }
//     catch (error) {
//         console.warn('uploadFile result', bucket, path, file, options, error);
//         throw error;
//     }
// };

// export const removeFile = async (bucket: string, paths: string[]) => {
//     try {
//         console.debug('removeFile', bucket, paths);
//         const { data, error } = await from(bucket).remove(paths);
//         if (error) throw error;
//         console.debug('removeFile result', data);
//         return data;
//     }
//     catch (error) {
//         console.warn('removeFile', bucket, paths, error);
//         throw error;
//     }
// };

// export const moveFile = async (bucket: string, fromPath: string, toPath: string) => {
//     try {
//         console.debug('moveFile', bucket, fromPath, toPath);
//         const { data, error } = await from(bucket).move(fromPath, toPath);
//         if (error) throw error;
//         console.debug('moveFile result', data);
//         return data;
//     }
//     catch (error) {
//         console.warn('moveFile', bucket, fromPath, toPath, error);
//         throw error;
//     }
// };

// export const listFiles = async (bucket: string, path: string, options?: SearchOptions, parameters?: FetchParameters) => {
//     try {
//         console.debug('listFiles', bucket, path);
//         const { data, error } = await from(bucket).list(path, options, parameters);
//         if (error) throw error;
//         console.debug('listFiles result', data);
//         return data as FileObject[];
//     }
//     catch (error) {
//         console.warn('listFiles', bucket, path, error);
//         throw error;
//     }
// };

// export const downloadFile = async (bucket: string, path: string, options?: TransformOptions) => {
//     try {
//         console.debug('downloadFile', bucket, path);
//         const { data, error } = await from(bucket).download(path, { transform: options });
//         if (error) throw error;
//         console.debug('downloadFile result', data);
//         return data;
//     }
//     catch (error) {
//         console.warn('downloadFile', bucket, path, error);
//         throw error;
//     }
// };

// export const getFileUrl = async (bucket: string, path: string, options?: TransformOptions) => {
//     try {
//         console.debug('downloadFile', bucket, path);
//         const { data, error } = await from(bucket).(path, { transform: options });
//         if (error) throw error;
//         console.debug('downloadFile result', data);
//         return data;
//     }
//     catch (error) {
//         console.warn('downloadFile', bucket, path, error);
//         throw error;
//     }
// };

// const ASSETS_BUCKET = 'assets';

const MEDIAS_BUCKET = 'medias';

const uploadMedia = (path: string, file: File) => supaPromise('uploadMedia',
    from(MEDIAS_BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: true,
    })
);

const getMediaFilePath = (groupId: string, file: File) => `${groupId}/${file.name}`;

export const medias$ = new Msg<Record<string, MediaInfo>>({});
export const mediaUploadByPath$ = new Msg<Record<string, number>>({});

const setMediaUploadProgress = (groupId: string, file: File, progress: number|null) => {
    mediaUploadByPath$.next(next => {
        const path = getMediaFilePath(groupId, file);
        if (progress === null) {
            return deleteKey({ ...next }, path);
        } else {
            return ({ ...next, [path]: progress });
        }
    });
}

export const uploadMedias = async (files: File[]) => {
    const results: { id: string; path: string; fullPath: string; }[] = [];
    const isAuth = isAuth$.v;
    const groupId = groupId$.v;
    if (!isAuth && !groupId) return results;
    for (const file of files) {
        setMediaUploadProgress(groupId, file, 0);
    }
    for (const file of files) {
        const path = getMediaFilePath(groupId, file);
        setMediaUploadProgress(groupId, file, 10);
        const result = await uploadMedia(path, file).catch(error => {
            console.error('uploadMedia', error);
        });
        if (result) results.push(result);
        setMediaUploadProgress(groupId, file, 100);
    }
    setTimeout(() => {
        for (const file of files) {
            setMediaUploadProgress(groupId, file, null);
        }
    }, 5000);
    await mediasRefresh();
    return results;
};

export const removeMedia = (path: string) => supaPromise('removeMedia',
    from(MEDIAS_BUCKET).remove([path])
);

export const moveMedia = (fromPath: string, toPath: string) => supaPromise('moveMedia',
    from(MEDIAS_BUCKET).move(fromPath, toPath)
);

// export const getMediaSignedUrl = async (path: string) => {
//     const result = await _toPromise(
//         'getMediaSignedUrl',
//         from(MEDIAS_BUCKET).createSignedUrl(path, 120)
//     );
//     return result?.signedUrl;
// };

export interface MediaInfo {
    id: string;
    path: string;
    updated: string;
    mimetype: string;
    size: number;
    data: MediaData;

    name: string;
}

export interface MediaData {
    jobId?: string;
    icon?: string; // path
    uhd?: string; // path
    hd?: string; // path
    sd?: string; // path
    svg?: string; // path
    pages?: { hd?: string }[];
    pdf?: string;
}

export interface FolderInfo {
    mimetype: 'folder';
    size: 0;
    name: string;
    path: string;
    medias: Record<string, MediaInfo>;
    folders: Record<string, FolderInfo>;
    parent?: FolderInfo;
}

export const getFolderPath = (path: string) => path ? path.substring(0, path.lastIndexOf('/')) : '';;
export const getFileName = (path: string) => path ? path.substring(path.lastIndexOf('/') + 1) : '';

export const getFolderTree = (medias: MediaInfo[]) => {
    const newFolder = (): FolderInfo => ({ mimetype: 'folder', size: 0, path: '', name: '', folders: {}, medias: {} });
    const root: FolderInfo = newFolder();
    sort(medias, m => m.path);
    for (const media of medias) {
        let folder = root;
        const names = media.path.split('/');
        names.pop();
        const paths = [];
        for (const name of names) {
            paths.push(name);
            folder = folder.folders[name] || (folder.folders[name] = {
                ...newFolder(),
                name,
                parent: folder,
                path: folder.path ? folder.path + '/' + name : name,
            });
        }
        folder.medias![media.name] = media;
    }
    const items: (MediaInfo|FolderInfo)[] = [];
    const _getFolderItems = (folder: FolderInfo, items: (MediaInfo|FolderInfo)[]) => {
        items.push(folder);
        items.push(...Object.values(folder.medias));
        for (const child of Object.values(folder.folders)) _getFolderItems(child, items);
    }
    _getFolderItems(root, items);
    return { root, items };
}

export const pathToUrl = (path?: string) => {
    return path ? "https://a.m4k.fr/" + path : '';
}

export const getMediaImageUrl = (media: MediaInfo|MediaData, size: 'uhd'|'hd'|'icon') => {
    console.debug('getMediaImageUrl', media, size);
    const { svg, icon, hd, uhd } = (media as MediaInfo).data || (media as MediaData);
    let image = (
        svg ? svg :
        size === 'icon' ? icon || hd :
        size === 'hd' ? hd || icon :
        uhd || hd || icon);
    if (!image) {
        console.warn('no image url', media);
        return null;
    }
    console.debug('getMediaImageUrl', media, size, image);
    return pathToUrl(image);
};

export const mediasRefresh = async () => {
    const isAuth = isAuth$.v;
    const groupId = groupId$.v;
    if (!isAuth && !groupId) return;
    const medias = await getMedias(groupId);
    medias$.set(valueBy(medias, a => a.id));
}