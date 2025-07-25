import type { FieldInfo } from '../components/Field.tsx';
import {
    _ContentModel,
    _DeviceModel,
    _MediaModel,
    _GroupModel,
    _JobModel,
    _MemberModel,
    _UserModel,
    _CategoryModel,
    _ProductModel,
    _ModifierModel,
    _SaleModel,
} from './_models.generated.ts';

export * from './_models.generated.ts';

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

export interface CategoryModel extends _CategoryModel {
    remote: Partial<CategoryModel>;
}

export interface ProductModel extends _ProductModel {
    remote: Partial<ProductModel>;
}

export interface ModifierModel extends _ModifierModel {
    remote: Partial<ModifierModel>;
}

export interface SaleModel extends _SaleModel {
    remote: Partial<SaleModel>;
}