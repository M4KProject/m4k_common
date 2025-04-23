import { JobModel } from "./interfaces";
import { authId$ } from "./auth";
import { Columns, jobRepo } from "./repos";
import { sleep } from "../helpers/async";
import { getServerTime, getTime } from "./serverTime";
import { toErr } from "../helpers/err";

const JOB_TIMEOUT = 30_000;

const _selectColumns: Columns<JobModel> = ['id', 'updated', 'action', 'status', 'progress', 'error', 'result'];
const _waitJobById: Record<string, Promise<JobModel>> = {};

export const addJob = async (groupId: string, action: JobModel['action'], input: JobModel['input']) => {
    console.debug('addJob', groupId, action, input);

    const authId = authId$.v;
    if (!authId) throw toErr('no authId');
    if (!groupId) throw toErr('no groupId');

    const job = await jobRepo.create({
        action,
        input,
        user_id: authId,
        group_id: groupId,
    }, _selectColumns);

    return job;
}

export const addJobAndWait = async (groupId: string, action: JobModel['action'], input: JobModel['input']) => {
    const job = await addJob(groupId, action, input);
    if (job) return await jobToPromise(job);
}

export const getJob = async (jobId: string) => {
    const job = await jobRepo.get(jobId, _selectColumns) || (
        { id: jobId, status: 'deleted' } as JobModel
    );
    if (!job.error && Math.abs(getServerTime() - getTime(job.updated)) > JOB_TIMEOUT) {
        job.error = 'timeout';
        jobRepo.sync(jobId, job, ['error']);
    }
    return job;
}

export const waitJob = async (jobId: string) => _waitJobById[jobId] || (
    _waitJobById[jobId] = (async () => {
        while (true) {
            const job = await getJob(jobId);
            if (job.status === 'finished' || job.error) return job;
            await sleep(3000);
        }
    })()
);

export const jobToPromise = <J extends JobModel>(job: J): Promise<J['result']> => (
    waitJob(job.id).then(job => {
        if (job.error) throw toErr(job.error, { job });
        return job.result;
    })
)