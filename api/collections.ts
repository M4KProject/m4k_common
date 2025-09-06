import {
  ContentModel,
  DeviceModel,
  MediaModel,
  GroupModel,
  JobModel,
  MemberModel,
  ModelBase,
  UserModel,
} from './models';
import { Coll } from './Coll';
import { global } from '../helpers/global';

export const coll = <T extends ModelBase>(name: string) => new Coll<T>(name);

export const contentColl = coll<ContentModel>('contents');
export const deviceColl = coll<DeviceModel>('devices');
export const mediaColl = coll<MediaModel>('medias');
export const groupColl = coll<GroupModel>('groups');
export const jobColl = coll<JobModel>('jobs');
export const memberColl = coll<MemberModel>('members');
export const userColl = coll<UserModel>('users');

global.contentColl = contentColl;
global.deviceColl = deviceColl;
global.mediaColl = mediaColl;
global.groupColl = groupColl;
global.jobColl = jobColl;
global.memberColl = memberColl;
global.userColl = userColl;
