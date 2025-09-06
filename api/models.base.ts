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
