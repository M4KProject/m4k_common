// GENERATED : 2025-09-10T19:38:13.480Z

import { AuthModelBase, ModelBase } from './models.base';

export interface _UserModel extends AuthModelBase {
  id: string;
  password: string;
  tokenKey: string;
  email: string;
  emailVisibility?: boolean;
  verified?: boolean;
  name?: string;
  avatar?: File | Blob | string;
}

export interface _ContentModel extends ModelBase {
  id: string;
  public?: boolean;
  key?: string;
  title?: string;
  type?: '' | 'empty' | 'form' | 'table' | 'html' | 'playlist' | 'hiboutik' | 'odoo';
  data?: any;
  files?: File | Blob | string;
  medias?: string[];
  group?: string;
}

export interface _DeviceModel extends ModelBase {
  id: string;
  online?: Date | string;
  key?: string;
  name?: string;
  info?: any;
  action?: string;
  input?: string;
  result?: any;
  capture?: File | Blob | string;
  files?: File | Blob | string;
  media?: string;
  user?: string;
  group?: string;
}

export interface _GroupModel extends ModelBase {
  id: string;
  key?: string;
  name?: string;
  plugins?: '' | 'hiboutik';
  user?: string;
}

export interface _JobModel extends ModelBase {
  id: string;
  action?: '' | 'test' | 'test2' | 'addMember';
  status?:
    | ''
    | 'pending'
    | 'processing'
    | 'finished'
    | 'failed'
    | 'deleted'
    | 'claimed'
    | 'created';
  progress?: number;
  error?: string;
  input?: any;
  result?: any;
  logs?: string;
  files?: File | Blob | string;
  media?: string;
  group?: string;
}

export interface _MediaModel extends ModelBase {
  id: string;
  generated?: Date | string;
  key?: string;
  title?: string;
  desc?: string;
  type?: string;
  bytes?: number;
  width?: number;
  height?: number;
  seconds?: number;
  progress?: number;
  data?: any;
  file?: File | Blob | string;
  parent?: string;
  user?: string;
  group?: string;
}

export interface _MemberModel extends ModelBase {
  id: string;
  role?: number;
  desc?: string;
  email?: string;
  user?: string;
  group?: string;
}

export interface _ApplicationModel extends ModelBase {
  id: string;
  name?: string;
  version?: string;
  active?: boolean;
  file?: File | Blob | string;
}

export interface _LockModel extends ModelBase {
  id: string;
  key?: string;
}
