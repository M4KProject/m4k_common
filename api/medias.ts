import { uuid } from '../utils/str';
import { needAuthId, needGroupId } from './messages';
import { JobModel } from './models';
import { toError } from '../utils/cast';
import { MsgDict } from '@common/utils';
import { mediaCtrl } from '@/admin/controllers';

const MAX_CONCURRENT_UPLOADS = 3;

export interface UploadItem extends JobModel {
  file: File;
}

export const uploadJobs$ = new MsgDict<UploadItem>({});

const update = (id: string, changes: Partial<UploadItem>) => uploadJobs$.merge({ [id]: changes });

const startUpload = async (item: UploadItem) => {
  const id = item.id;

  try {
    const file = item.file;
    if (!file) return;

    update(id, { status: 'processing' });

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

    update(id, { progress: 100, status: 'finished' });

    console.info('upload success', item, media);
    return media;
  } catch (e) {
    const error = toError(e);
    console.warn('upload failed', item, error);
    update(id, { error: error.message, status: 'failed' });
  } finally {
    setTimeout(() => uploadJobs$.delete(id), 5000);
  }
};

const processQueue = async () => {
  while (true) {
    const items = Object.values(uploadJobs$.v);
    if (items.filter((i) => i.status === 'processing').length >= MAX_CONCURRENT_UPLOADS) {
      return;
    }

    const item = items.find((i) => i.status === 'pending');
    if (!item) {
      return;
    }

    await startUpload(item);
  }
};

export const upload = (files: File[]): string[] => {
  const ids = files.map((file) => {
    const id = uuid();
    uploadJobs$.merge({
      [id]: {
        id,
        file,
        name: file.name,
        action: 'upload',
        status: 'pending',
      },
    });
    return id;
  });
  processQueue();
  return ids;
};
