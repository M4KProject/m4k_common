import { ContentModel } from './models';
import { SyncColl } from './SyncColl';

export const syncContents = new SyncColl<ContentModel>('contents');
