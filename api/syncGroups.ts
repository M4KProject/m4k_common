import { GroupModel } from "./models";
import { SyncColl } from "./SyncColl";

export const syncGroups = new SyncColl<GroupModel>("groups");