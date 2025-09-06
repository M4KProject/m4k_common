// GENERATED : 2025-06-28T14:41:19.352Z

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
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
  verified?: boolean;
}

export type ModelReplace<T extends ModelBase> = Omit<
  T,
  'collectionId' | 'collectionName' | 'created' | 'updated'
> &
  Partial<ModelBase>;

export type ModelCreate<T extends ModelBase> = Omit<ModelReplace<T>, 'id'> & {
  id?: string;
};

export type ModelUpsert<T extends ModelBase> = Omit<ModelReplace<T>, 'id'>;

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

export interface _UserModel extends AuthModelBase {
  id: string;
  password: string;
  tokenKey: string;
  email: string;
  emailVisibility?: boolean;
  verified?: boolean;
  name?: string;
  avatar?: File | Blob | string;
  device?: string;
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
  started?: Date | string;
  online?: Date | string;
  key?: string;
  name?: string;
  type?: string;
  version?: number;
  width?: number;
  height?: number;
  action?: string;
  status?: string;
  info?: any;
  input?: any;
  result?: any;
  capture?: File | Blob | string;
  user?: string;
  group?: string;
  content?: string;
}

export interface _MediaModel extends ModelBase {
  id: string;
  type?: string;
  name?: string;
  desc?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  data?: any;
  file?: File | Blob | string;
  variants?: File | Blob | string;
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
  action?: '' | 'test' | 'hiboutik' | 'odoo';
  status?: '' | 'pending' | 'processing' | 'finished' | 'failed' | 'deleted';
  progress?: number;
  error?: string;
  input?: any;
  result?: any;
  logs?: string;
  files?: File | Blob | string;
  group?: string;
}

export interface _MemberModel extends ModelBase {
  id: string;
  role?: number;
  desc?: string;
  user?: string;
  group?: string;
}

export interface _CategoryModel extends ModelBase {
  id: string;
  key?: string;
  name?: string;
  desc?: string;
  order?: number;
  image?: File | Blob | string;
  disabled?: boolean;
  deleted?: boolean;
  data?: any;
  remote?: any;
  parent?: string;
  group?: string;
}

export interface _ProductModel extends ModelBase {
  id: string;
  key?: string;
  name?: string;
  desc?: string;
  order?: number;
  price?: number;
  disabled?: boolean;
  image?: File | Blob | string;
  data?: any;
  remote?: any;
  deleted?: boolean;
  category?: string;
  group?: string;
}

export interface _ModifierModel extends ModelBase {
  id: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  price?: number;
  image?: File | Blob | string;
  data?: any;
  group?: string;
  sync?: any;
}

export interface _SaleModel extends ModelBase {
  id: string;
  total?: number;
  completed?: Date | string;
  takeaway?: boolean;
  lines?: any;
  data?: any;
  group?: string;
  sync?: any;
}
