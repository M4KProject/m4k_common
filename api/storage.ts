import { supabase } from "./_generated";
import { supa } from "./helpers";
import { groupId$ } from "./repos";
import Msg from "@common/helpers/Msg";
import { isAuth$ } from "./auth";
import { getMedias } from "./rpc";
import { byId, deleteKey, sort, uuid } from "@common/helpers";

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

export const from = (groupId: string) => supabase.storage.from(groupId);

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

interface UploadInfo {
    bucketId: string,
    name: string,
    file: File|string,
    progress: number
}

export const medias$ = new Msg<Record<string, MediaInfo>>({});
export const upload$ = new Msg<UploadInfo[]>([]);

const _upload = async (bucketId: string, name: string, file: File|string) => {
    await supa('upload', () => (
        from(bucketId).upload(name, file, {
            cacheControl: '3600',
            upsert: true,
        })
    ));
    await mediasRefresh();
}

export const upload = async (bucketId: string, name: string, file: File|string) => {
    // const u: UploadInfo = { bucketId, name, file, progress: 0 };
    // upload$.next(upload => [...upload, ]);
    // uploadingByNameByBucketId$.next(uploadingByNameByBucketId => ({
    //     ...uploadingByNameByBucketId,
    //     [bucketId]: {
    //         ...uploadingByNameByBucketId[bucketId],
    //         [name]: {
    //             file,
    //             progress: 0,
    //         },
    //     }
    // }));
    console.debug('upload', bucketId, name, file);
    await _upload(bucketId, name, file);
    await mediasRefresh();
}

// const getMediaFileName = (file: File) => file.name;

// const setMediaUploadProgress = (file: File, progress: number|null) => {
//     mediaUploadByPath$.next(next => {
//         const name = getMediaFileName(file);
//         if (progress === null) {
//             return deleteKey({ ...next }, name);
//         } else {
//             return ({ ...next, [name]: progress });
//         }
//     });
// }

// export const uploadMedias = async (files: File[]) => {
//     const results: { id: string; path: string; fullPath: string; }[] = [];
//     const isAuth = isAuth$.v;
//     const groupId = groupId$.v;
//     if (!isAuth && !groupId) return results;
//     for (const file of files) {
//         setMediaUploadProgress(file, 0);
//     }
//     for (const file of files) {
//         const name = getMediaFileName(file);
//         setMediaUploadProgress(file, 10);
//         const result = await upload(groupId, name, file).catch(error => {
//             console.error('uploadMedia', error);
//         });
//         if (result) results.push(result);
//         setMediaUploadProgress(file, 100);
//     }
//     setTimeout(() => {
//         for (const file of files) {
//             setMediaUploadProgress(file, null);
//         }
//     }, 5000);
//     await mediasRefresh();
//     return results;
// };

export const rm = async (bucketId: string, name: string) => {
    console.debug('rm', bucketId, name);
    const medias = Object.values(medias$.v)
        .filter(m => m.name.startsWith(name) && m.bucketId === bucketId);
    console.debug('rm medias', medias);
    medias$.next(prev => {
        const next = { ...prev };
        for (const media of medias)
            deleteKey(next, media.id);
        return next;
    });
    for (const media of medias)
        await supa('rm', () => from(bucketId).remove([media.name]));
    await mediasRefresh();
};

export const mv = async (bucketId: string, fromName: string, toName: string) => {
    console.debug('mv', bucketId, fromName, toName);
    if (toName.startsWith('/')) toName = toName.substring(1);
    const medias = Object.values(medias$.v)
        .filter(m => m.name.startsWith(fromName) && m.bucketId === bucketId);
    console.debug('mv medias', medias);
    medias$.next(prev => {
        const next = { ...prev };
        for (const media of medias) {
            next[media.id] = {
                ...media,
                name: media.name.replace(fromName, toName)
            };
        }
        return next;
    });
    for (const media of medias) {
        await supa('mv',
            () => from(bucketId).move(
                media.name,
                media.name.replace(fromName, toName),
            )
        );
    }
};

// export const getMediaSignedUrl = async (path: string) => {
//     const result = await _toPromise(
//         'getMediaSignedUrl',
//         from(MEDIAS_BUCKET).createSignedUrl(path, 120)
//     );
//     return result?.signedUrl;
// };

export interface MediaData {
    jobId?: string;
    thumbnail?: string; // path
    icon?: string; // path
    hd?: string; // path
    sd?: string; // path
    svg?: string; // path
    source?: string; // path
    pages?: { hd?: string }[];
    pdf?: string;
}

export interface MediaInfo {
    id: string;
    bucketId: string;
    name: string;
    updated: string;
    mimetype: string;
    size: number;
    data: MediaData;
    version: string;
}

export const folderMimetype = 'application/folder';

export interface FolderInfo extends MediaInfo {
    mimetype: typeof folderMimetype;
    medias: Record<string, MediaInfo>;
    folders: Record<string, FolderInfo>;
    parent?: FolderInfo;
}

export const getFolderName = (name: string) => name ? name.substring(0, name.lastIndexOf('/')) : '';;
export const getFileName = (name: string) => name ? name.substring(name.lastIndexOf('/') + 1) : '';

export const newFolder = (): FolderInfo => ({
    id: uuid(),
    bucketId: '',
    name: '',
    updated: '',
    size: 0,
    data: {},
    version: '',
    mimetype: folderMimetype,
    medias: {},
    folders: {},
});

export const getFolderTree = (medias: MediaInfo[]) => {
    const newFolder = (): FolderInfo => ({
        id: uuid(),
        bucketId: '',
        name: '',
        updated: '',
        size: 0,
        data: {},
        version: '',
        mimetype: folderMimetype,
        medias: {},
        folders: {},
    });
    const root: FolderInfo = newFolder();
    sort(medias, m => m.name);
    for (const media of medias) {
        let folder = root;
        const names = media.name.split('/');
        names.pop();
        const paths = [];
        for (const name of names) {
            paths.push(name);
            folder = folder.folders[name] || (folder.folders[name] = {
                ...newFolder(),
                parent: folder,
                name: folder.name ? folder.name + '/' + name : name,
            });
        }
        folder.medias![getFileName(media.name)] = media;
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

export const getMediaImageUrl = (media: MediaInfo|MediaData, size: keyof MediaData) => {
    const data = (media as MediaInfo).data || (media as MediaData);
    let image = data[size];
    if (!image) return null;
    console.debug('getMediaImageUrl', media, size, image);
    return pathToUrl(String(image));
};

export const mediasRefresh = async () => {
    const isAuth = isAuth$.v;
    const groupId = groupId$.v;
    if (!isAuth && !groupId) return;
    const medias = await getMedias(groupId);
    medias$.set(byId(medias));
}
