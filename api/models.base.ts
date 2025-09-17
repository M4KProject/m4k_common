export interface ModelId {
  id: string;
}

export interface ModelBase extends ModelId {
  created: Date;
  updated: Date;
  // collectionId?: string;
  // collectionName?: string;
}

export interface AuthModelBase extends ModelBase {
  email?: string;
  username?: string;
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
  verified?: boolean;
}

export type ModelCreate<T extends ModelBase> = Omit<T, 'created' | 'updated' | 'id'>;
export type ModelUpdate<T extends ModelBase> = Partial<ModelCreate<T>>;

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
