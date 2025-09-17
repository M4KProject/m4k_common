import { MediaModel } from './models';
import { SyncColl } from './SyncColl';

export const syncMedias = new SyncColl<MediaModel>('medias');
