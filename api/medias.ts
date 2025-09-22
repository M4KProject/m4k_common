import { uuid } from '../utils/str';
import { retry, sleep } from '../utils/async';
import { needAuthId, needGroupId } from './messages';
import { MediaModel } from './models';
import { deleteKey } from '../utils/obj';
import { toError } from '../utils/cast';
import { MsgDict } from '@common/utils';
import { mediaCtrl } from '@/admin/controllers';

const MAX_CONCURRENT_UPLOADS = 3;
const MAX_RETRY = 3;

export interface UploadItem {
  id: string;
  file: File;
  name: string;
  status: 'pending' | 'uploading' | 'processing' | 'failed' | 'success';
  media?: MediaModel;
  progress?: number;
  created?: number;
  started?: number;
  error?: any;
}

export const uploadItems$ = new MsgDict<UploadItem>({});

const update = (id: string, changes: Partial<UploadItem>) =>
  uploadItems$.merge({ [id]: { ...uploadItems$.v[id], ...changes } });

const startUpload = (item: UploadItem) =>
  retry(async () => {
    const id = item.id;

    try {
      const file = item.file;
      if (!file) return;

      update(id, { status: "uploading" });

      const media = await mediaCtrl.create(
        {
          title: String(file.name),
          source: file,
          group: needGroupId(),
          user: needAuthId(),
        },
        {
          req: {
            xhr: true,
            onProgress: (progress) => {
              update(id, { progress: progress * 100 });
            },
          },
        }
      );

      update(id, { media, progress: 100, status: "success" });

      console.info('upload success', item, media);
      return media;
    } catch (e) {
      const error = toError(e);
      console.warn('upload failed, retrying in 5s', item, error);
      update(id, { error });
      await sleep(5000);
      throw error;
    }
  }, MAX_RETRY);

const processQueue = async () => {
  while (true) {
    const items = Object.values(uploadItems$.v);
    if (items.filter((i) => i.status === "uploading").length >= MAX_CONCURRENT_UPLOADS) return;

    const item = items.find((i) => i.status === "pending");
    if (!item) return;

    const id = item.id;

    try {
      await startUpload(item);
    } catch (e) {
      const error = toError(e);
      console.error('upload failed', item, error);
      update(item.id, { status: "failed", error });
    }

    setTimeout(() => uploadItems$.next((items) => deleteKey({ ...items }, id)), 10000);
  }
};

export const upload = (files: File[]): string[] => {
  const ids = files.map((file) => {
    const id = uuid();
    uploadItems$.merge({
      [id]: { id, file, name: file.name, status: "pending" } as UploadItem,
    });
    return id;
  });
  processQueue();
  return ids;
};
