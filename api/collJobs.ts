import { coll } from "./Coll";
import { JobModel } from "./models";

export const collJobs = coll<JobModel>('jobs');