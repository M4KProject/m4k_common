import { valueBy } from "@common/helpers/groupBy";
import { supabase } from "./_generated";
import { sort } from "@common/helpers/array";

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

const _toPromise = async <T>(name: string, promiseLike: PromiseLike<{ data: T|null, error: StorageError|null; }>): Promise<T|null> => {
    try {
        console.debug('storage', name);
        const { data, error } = await promiseLike;
        if (error) throw error;
        console.debug('storage', name, 'result', data);
        return data;
    }
    catch (error) {
        console.warn('storage', name, 'error', error);
        throw error;
    }
}


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

export const uploadMedia = (path: string, file: File) => (
    _toPromise('uploadMedia',
        from(MEDIAS_BUCKET).upload(path, file, {
            cacheControl: '3600',
            upsert: true,
        })
    )
);

export const removeMedia = (path: string) => (
    _toPromise('removeMedia',
        from(MEDIAS_BUCKET).remove([path])
    )
);

export const moveMedia = async (fromPath: string, toPath: string) => (
    _toPromise('moveMedia',
        from(MEDIAS_BUCKET).move(fromPath, toPath)
    )
);

export const getMediaPreviewUrl = async (media: MediaInfo) => {
    if (media.mimetype.startsWith('image')) {
        const result = await _toPromise(
            'getMediaPreviewUrl',
            from(MEDIAS_BUCKET).createSignedUrl(media.path, 120, { transform: { width: 200 } })
        )
        return result?.signedUrl;
    }
    return "";
}

export const getMediaSignedUrl = async (path: string) => {
    const result = await _toPromise(
        'getMediaSignedUrl',
        from(MEDIAS_BUCKET).createSignedUrl(path, 120)
    );
    return result?.signedUrl;
};

export interface MediaInfo {
    id: string;
    name: string;
    mimetype: string;
    path: string;
    size: number;
    updated: string;
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

export const getFolderPath = (path: string) => path.substring(0, path.lastIndexOf('/'));
export const getFileName = (path: string) => path.substring(path.lastIndexOf('/') + 1);

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