import { FieldInfo, FieldType } from '@common/components';
import {
    _ContentModel,
    _DeviceModel,
    _MediaModel,
    _GroupModel,
    _JobModel,
    _MemberModel,
    _UserModel,
} from './_models.generated';

export * from './_models.generated';

export interface ContentModel extends _ContentModel {}

export interface FormContentModel extends ContentModel {
    data: {
        fields: FieldInfo[],
        values: { [prop: string]: any },
    }
}

export interface TableContentModel extends ContentModel {
    data: {
        fields: FieldInfo[],
        items: { [prop: string]: any }[],
    }
}

export interface DeviceModel extends _DeviceModel {}

export interface MediaModel extends _MediaModel {}

export interface GroupModel extends _GroupModel {}

export interface JobModel extends _JobModel {}

export enum Role {
    viewer = 10,
    editor = 20,
    admin = 30,
}

export interface MemberModel extends _MemberModel {
    role?: Role; // admin > editor > viewer
}

export interface UserModel extends Omit<_UserModel, 'tokenKey'> {}

export interface DeviceModel extends _DeviceModel {
    // config?: {
    //     kiosk?: boolean;
    //     startUrl?: string;
    //     url?: string;
    //     zipPath?: string;
    //     installDir?: string;
    //     logs?: boolean;
    //     logsRemote?: ''|'debug'|'info'|'warn'|'error';
    //     screenBrightness?: number;
    //     script?: string|string[];
    //     rotate?: number;
    //     webviewRotate?: number;
    //     settings?: Record<string, any>;
    //     default?: number;

    //     reloadIntervalMs?: number;
    //     updateIntervalMs?: number;
    //     usbUpdateIntervalMs?: number;
    //     captureIntervalMs?: number;
    //     captureType?: 'device'|'preview';

    //     playlist?: {
    //         timer?: number;
    //         items?: {
    //             timer?: number;
    //             fileUrl?: string;
    //         }[],
    //     };
    // };
    // info?: {
    //     webview?: string;
    //     soft?: string;
    //     os?: string;
    //     ip?: string;
    //     width?: number;
    //     height?: number;
    //     internalStorage?: string;
    //     externalStorage?: string;
    //     softId?: string;
    //     softName?: string;
    //     model?: string;
    // };
    // result?: {
    //     action?: _DeviceModel['action'];
    //     input?: _DeviceModel['input'];
    //     success?: boolean;
    //     error?: { name?: string; message: string };
    //     value?: any;
    // };
}
