
import { sleep } from "../helpers/async";
import { toErr } from "../helpers/err";
import { JobModel } from "./models";
import { jobColl } from "./collections";
import { needAuthId, needGroupId } from "./messages";
import { Msg } from "@common/helpers/Msg";

export const addJob = async (action: JobModel['action'], input: JobModel['input']) => {
    console.debug('addJob', action, input);
    return await jobColl.create({
        action,
        input,
        user: needAuthId(),
        group: needGroupId(),
        status: 'pending',
    });
}

const _msgById: Record<string, Msg<JobModel>> = {};
const jobProgress = (job: JobModel) => _msgById[job.id] || (
    _msgById[job.id] = new Msg(job)
);

const _waitJob = async (job: JobModel) => {
    const job$ = jobProgress(job);
    while (true) {
        const next = await jobColl.get(job.id);
        job$.set(next);
        if (next.error) throw toErr(next.error, { job: next });
        if (next.status === 'finished') return next;
        await sleep(3000);
    }
};

const _waitById: Record<string, Promise<JobModel>> = {};
export const waitJob = async (job: JobModel) => _waitById[job.id] || (
    _waitById[job.id] = _waitJob(job)
);