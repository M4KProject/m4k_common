import { JobModel } from './models';
import { SyncColl } from './SyncColl';

export const syncJobs = new SyncColl<JobModel>('jobs');
