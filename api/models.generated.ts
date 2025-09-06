// GENERATED : 2025-09-06T17:31:11.586Z

import { AuthModelBase, ModelBase } from "./models.base";


export interface _UserModel extends AuthModelBase {
    id: string;
    password: string;
    tokenKey: string;
    email: string;
    emailVisibility?: boolean;
    verified?: boolean;
    name?: string;
    avatar?: File|Blob|string;
}

export interface _ContentModel extends ModelBase {
    id: string;
    public?: boolean;
    key?: string;
    title?: string;
    type?: ""|"empty"|"form"|"table"|"html"|"playlist"|"hiboutik"|"odoo";
    data?: any;
    files?: File|Blob|string;
    medias?: string[];
    group?: string;
}

export interface _DeviceModel extends ModelBase {
    id: string;
    online?: Date|string;
    key?: string;
    name?: string;
    info?: any;
    action?: string;
    input?: string;
    result?: any;
    capture?: File|Blob|string;
    files?: File|Blob|string;
    user?: string;
    group?: string;
    content?: string;
}

export interface _GroupModel extends ModelBase {
    id: string;
    key?: string;
    name?: string;
    plugins?: ""|"hiboutik";
    user?: string;
}

export interface _JobModel extends ModelBase {
    id: string;
    action?: ""|"test"|"hiboutik"|"odoo";
    status?: ""|"pending"|"processing"|"finished"|"failed"|"deleted";
    progress?: number;
    error?: string;
    input?: any;
    result?: any;
    logs?: string;
    files?: File|Blob|string;
    media?: string;
    group?: string;
}

export interface _MediaModel extends ModelBase {
    id: string;
    name?: string;
    desc?: string;
    type?: string;
    bytes?: number;
    progress?: number;
    source?: File|Blob|string;
    variants?: File|Blob|string;
    meta?: any;
    vmeta?: any;
    group?: string;
}

export interface _MemberModel extends ModelBase {
    id: string;
    role?: number;
    desc?: string;
    user?: string;
    group?: string;
}

export interface _ConvertModel extends ModelBase {
    id: string;
    status?: ""|"pending"|"processing"|"waiting"|"finished"|"failed"|"deleted";
    type?: string;
    size?: number;
    width?: number;
    height?: number;
    ms?: number;
    file?: File|Blob|string;
    info?: any;
    media?: string;
    group?: string;
}

export interface _ApplicationModel extends ModelBase {
    id: string;
    name?: string;
    version?: string;
    active?: boolean;
    file?: File|Blob|string;
}

export interface _LogModel extends ModelBase {
    id: string;
    booted?: Date|string;
    serial?: string;
    cmd?: string;
    result?: string;
    error?: string;
    logs?: string;
    files?: File|Blob|string;
}

export interface _TestModel extends ModelBase {
    id: string;
    name?: string;
}
