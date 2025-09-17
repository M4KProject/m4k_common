import { coll } from "./Coll";
import { GroupModel } from "./models";

export const collGroups = coll<GroupModel>('groups');