import { ContentModel, DeviceModel, MediaModel, GroupModel, JobModel, MemberModel, ModelBase, UserModel } from './models';
import { Coll } from './Coll';

export const coll = <T extends ModelBase>(name: string) => new Coll<T>(name);

export const contentColl = coll<ContentModel>('contents');
export const deviceColl = coll<DeviceModel>('devices');
export const mediaColl = coll<MediaModel>('medias');
export const groupColl = coll<GroupModel>('groups');
export const jobColl = coll<JobModel>('jobs');
export const memberColl = coll<MemberModel>('members');
export const userColl = coll<UserModel>('users');

const g = (window as any);
g.contentColl = contentColl;
g.deviceColl = deviceColl;
g.mediaColl = mediaColl;
g.groupColl = groupColl;
g.jobColl = jobColl;
g.memberColl = memberColl;
g.userColl = userColl;
