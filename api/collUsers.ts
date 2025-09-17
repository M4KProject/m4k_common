import { coll } from './Coll';
import { UserModel } from './models';

export const collUsers = coll<UserModel>('users');
