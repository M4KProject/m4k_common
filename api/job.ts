import { toErr } from '../helpers/err';
import { JobModel } from './models';
import { jobColl } from './collections';
import { needGroupId } from './messages';

const jobEndedStatus: Partial<Record<JobModel['status'], 1>> = {
  deleted: 1,
  failed: 1,
  finished: 1,
};

export const addJob = async <J extends JobModel = JobModel>(
  action: J['action'],
  input: J['input'],
  onProgress?: (job: J) => void,
  timeout?: number,
) => {
  console.debug('addJob', action, input);
  const group = needGroupId();
  console.debug('job pending', action, input, group);
  const job = await jobColl.create({
    action,
    input,
    group,
    status: 'pending',
  });
  onProgress(job as J);
  return await new Promise(async (resolve, reject) => {
    let lastJob = job as J;

    const onUpdate = (job: J, action: "update" | "create" | "delete") => {
      lastJob = job;
      onProgress(job as J);
      if (jobEndedStatus[job.status] || action === "delete") {
        unsubscribe();
        clearInterval(intervalRef);
        clearTimeout(timeoutRef);
        resolve(job);
      }
    }

    const unsubscribe = await jobColl.subscribe(job.id, onUpdate);

    const intervalRef = setInterval(onUpdate, 10 * 1000);

    const timeoutRef = setTimeout(() => {
      reject(toErr('job timeout'));
      onUpdate(lastJob, "delete");
    }, timeout || 300 * 1000);
  })
};