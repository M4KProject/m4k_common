import { DRoot } from "../helpers/D";
import { _MemberModel, _ContentModel, _GroupModel, _DeviceModel } from "./_generated"

export interface MemberModel extends _MemberModel {
    role: 'none'|'viewer'|'editor'|'admin';
}
export type MemberRole = MemberModel['role'];


export interface SiteContentModel extends _ContentModel {
    type: 'page';
    data: DRoot;
}
export interface PlaylistContentModel extends _ContentModel {
    type: 'playlist';
    data: {},
}
export type ContentModel = SiteContentModel | PlaylistContentModel;
export type ContentType = ContentModel['type'];


export interface GroupModel extends _GroupModel {}


export interface DeviceModel extends _DeviceModel {}

