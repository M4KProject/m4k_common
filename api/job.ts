import { JobModel } from './models';
import { jobColl } from './collections';
import { needGroupId } from './messages';
import { isExpired } from '@common/utils/date';
import { toVoid } from '@common/utils/cast';

const jobEndedStatus: Partial<Record<JobModel['status'], 1>> = {
  deleted: 1,
  failed: 1,
  finished: 1,
};

export const addJob = async <J extends JobModel = JobModel>(
  action: J['action'],
  input: J['input'],
  onProgress: (job: J) => void = toVoid
) => {
  console.debug('addJob', action, input);
  const group = needGroupId();

  console.debug('job pending', action, input, group);
  let job = await jobColl.create({ action, input, group });

  onProgress(job as J);

  await new Promise<void>(async (resolve, reject) => {
    const onUpdate = (next: JobModel | null, action: 'update' | 'create' | 'delete') => {
      console.debug('addJob onUpdate', job, action);
      if (next) job = next;

      if (action === 'delete') job.status = 'deleted';

      if (isExpired(job.updated, 10000)) {
        job.status = 'failed';
        job.error = 'timeout';
      }

      onProgress(job as J);

      if (jobEndedStatus[job.status]) {
        unsubscribe();
        clearInterval(intervalRef);
        resolve();
      }
    };

    const unsubscribe = await jobColl.subscribe(job.id, onUpdate);

    const intervalRef = setInterval(async () => {
      const next = await jobColl.get(job.id);
      onUpdate(next, next ? 'update' : 'delete');
    }, 10 * 1000);
  });

  return job as J;
};
