// GENERATED : 2025-05-27T13:27:00.037Z

export interface ModelBase {
  // collectionId: string;
  // collectionName: string;
  id: string;
  created: Date;
  updated: Date;
}

export interface AuthModelBase extends ModelBase {
  email?: string;
  username?: string;
  password?: string;
  passwordConfirm?: string;
  verified?: boolean;
}

export type ModelReplace<T extends ModelBase> = Omit<
  T,
  "collectionId" | "collectionName" | "created" | "updated"
> &
  Partial<ModelBase>;

export type ModelCreate<T extends ModelBase> = Omit<ModelReplace<T>, "id"> & {
  id?: string;
};

export type ModelUpsert<T extends ModelBase> = Omit<ModelReplace<T>, "id">;

export type ModelUpdate<T extends ModelBase> = Partial<ModelUpsert<T>>;

export type Keys<T> = { [K in keyof T]: K extends symbol ? never : K }[keyof T];

export interface FindOptions<T extends ModelBase> {
  select?: Keys<T>[];
  where?: { [P in keyof T]?: string | number | Date };
  orderBy?: (Keys<T> | `-${Keys<T>}`)[];
  filter?: string;
  fields?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}

export interface __superuserModel extends AuthModelBase {
    id: string;
    tokenKey: string;
    emailVisibility?: boolean;
    verified?: boolean;
}

export interface _UserModel extends AuthModelBase {
    id: string;
    tokenKey: string;
    emailVisibility?: boolean;
    verified?: boolean;
    name?: string;
    avatar?: File|Blob|string;
}

export interface __authOriginModel extends ModelBase {
    id: string;
    collectionRef: string;
    recordRef: string;
    fingerprint: string;
}

export interface __externalAuthModel extends ModelBase {
    id: string;
    collectionRef: string;
    recordRef: string;
    provider: string;
    providerId: string;
}

export interface __mfaModel extends ModelBase {
    id: string;
    collectionRef: string;
    recordRef: string;
    method: string;
}

export interface __otpModel extends ModelBase {
    id: string;
    collectionRef: string;
    recordRef: string;
    sentTo?: string;
}

export interface _ContentModel extends ModelBase {
    id: string;
    public?: boolean;
    key?: string;
    title?: string;
    data?: any;
    group?: string[];
    dependencies?: string[];
}

export interface _DeviceModel extends ModelBase {
    id: string;
    started?: Date|string;
    online?: Date|string;
    key?: string;
    name?: string;
    type?: string;
    version?: number;
    width?: number;
    height?: number;
    info?: any;
    input?: any;
    result?: any;
    user?: string[];
}

export interface _FileModel extends ModelBase {
    id: string;
    type?: string;
    path?: string;
    title?: string;
    size?: number;
    width?: number;
    height?: number;
    source?: File|Blob|string;
    formats?: File|Blob|string;
    owner?: string[];
    group?: string[];
}

export interface _GroupModel extends ModelBase {
    id: string;
    key?: string;
    name?: string;
    owner?: string[];
}

export interface _JobModel extends ModelBase {
    id: string;
    progress?: number;
    input?: any;
    result?: any;
    error?: string;
    user?: string[];
    group?: string[];
}

export interface _MemberModel extends ModelBase {
    id: string;
    role?: number;
    desc?: string;
    isDevice?: boolean;
    user?: string[];
    group?: string[];
}
