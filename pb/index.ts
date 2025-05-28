import {
    ModelBase,
    _ContentModel,
    _DeviceModel,
    _FileModel,
    _GroupModel,
    _JobModel,
    _MemberModel,
    _UserModel,
} from './_models.generated';
import { PbRepo } from './PbRepo';

export interface ContentModel extends _ContentModel {}
export interface DeviceModel extends _DeviceModel {}
export interface FileModel extends _FileModel {}
export interface GroupModel extends _GroupModel {}
export interface JobModel extends _JobModel {}
export interface MemberModel extends _MemberModel {}
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

export const pbRepo = <T extends ModelBase>(name: string) => new PbRepo<T>(name);

export const contentRepo = pbRepo<ContentModel>('contents');
export const deviceRepo = pbRepo<DeviceModel>('devices');
export const fileRepo = pbRepo<FileModel>('files');
export const groupRepo = pbRepo<GroupModel>('groups');
export const jobRepo = pbRepo<JobModel>('jobs');
export const memberRepo = pbRepo<MemberModel>('members');
export const userRepo = pbRepo<UserModel>('users');