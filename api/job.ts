
import { sleep } from "../helpers/async.ts";
import { toErr } from "../helpers/err.ts";
import { JobModel } from "./models.ts";
import { jobColl } from "./collections.ts";
import { needGroupId } from "./messages.ts";
import { Msg } from "../helpers/Msg.ts";

export const addJob = async (action: JobModel['action'], input: JobModel['input']) => {
    console.debug('addJob', action, input);
    return await jobColl.create({
        action,
        input,
        group: needGroupId(),
        status: 'pending',
    });
}

const _msgById: Record<string, Msg<JobModel|null>> = {};
const jobProgress = (job: JobModel) => _msgById[job.id] || (
    _msgById[job.id] = new Msg<JobModel|null>(job)
);

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
export const waitJob = (job: JobModel) => _waitById[job.id] || (
    _waitById[job.id] = _waitJob(job)
);