import { sleep } from '../helpers/async';
import { toErr } from '../helpers/err';
import { JobModel } from './models';
import { jobColl } from './collections';
import { needGroupId } from './messages';
import { Msg } from '../helpers/Msg';

export const addJob = async (action: JobModel['action'], input: JobModel['input']) => {
  console.debug('addJob', action, input);
  const group = needGroupId();
  console.debug('job pending', action, input, group);
  return await jobColl.create({
    action,
    input,
    group,
    status: 'pending',
  });
};

const _msgById: Record<string, Msg<JobModel | null>> = {};
const jobProgress = (job: JobModel) =>
  _msgById[job.id] || (_msgById[job.id] = new Msg<JobModel | null>(job));

const _waitJob = async (job: JobModel) => {
  const job$ = jobProgress(job);
  while (true) {
    const next = await jobColl.get(job.id);
    job$.set(next);
    if (next) {
      if (next.error) throw toErr(next.error, { job: next });
      if (next.status === 'finished') return next;
    }
    await sleep(3000);
  }
};

const _waitById: Record<string, Promise<JobModel>> = {};
export const waitJob = (job: JobModel) => _waitById[job.id] || (_waitById[job.id] = _waitJob(job));
