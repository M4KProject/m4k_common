import { coll } from "./Coll";
import { MemberModel } from "./models";

export const collMembers = coll<MemberModel>('members');