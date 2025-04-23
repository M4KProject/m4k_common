import type { FieldInfo } from "@common/components/Field";
import { _MemberModel, _ContentModel, _GroupModel, _DeviceModel, _JobModel } from "./_generated"

// MemberModel
export interface MemberModel extends _MemberModel {
    role: 'none'|'viewer'|'editor'|'admin';
}
export type MemberRole = MemberModel['role'];

// ContentModel
export interface ContentModelBase extends _ContentModel {}
export interface EmptyContentModel extends ContentModelBase {
    type: 'empty';
}
export interface FormContentModel extends ContentModelBase {
    type: 'form';
    data: {
        fields: FieldInfo[];
        values: { [name: string]: any; };
    }
}
export interface TableContentModel extends ContentModelBase {
    type: 'table';
    data: {
        fields: FieldInfo[];
        items: { [name: string]: any; }[];
    };
}
export interface HtmlContentModel extends ContentModelBase {
    type: 'html';
    data: {
        html: string;
        css: string;
        js: string;
    };
}
// export interface SiteContentModel extends _ContentModel {
//     type: 'site';
//     data: DRoot;
// }
// export interface PlaylistContentModel extends _ContentModel {
//     type: 'playlist';
//     data: {};
// }

export type ContentModel = 
    EmptyContentModel |
    FormContentModel |
    TableContentModel |
    HtmlContentModel;
export type ContentType = ContentModel['type'];

// GroupModel
export interface GroupModel extends _GroupModel {}

// DeviceModel
export interface DeviceModel extends _DeviceModel {}

// JobModel
interface _JobModelBase extends _JobModel {
    status?: 'pending'|'processing'|'finished'|'deleted';
}
export interface ConverterJobModel extends _JobModelBase {
    action: 'convert';
    input: {
        path: string;
    };
}
export type JobModel = ConverterJobModel;
export type JobAction = JobModel['action'];
