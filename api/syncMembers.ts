import { MemberModel } from './models';
import { SyncColl } from './SyncColl';

export const syncMembers = new SyncColl<MemberModel>('members');
