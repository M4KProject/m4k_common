import { deleteKey } from "../helpers/object";
import { byId } from "../helpers/by";
import { toNbr } from "../helpers/cast";
import { Err, toErr } from "../helpers/err";
import { Model, supabase } from "./_generated";
import { checkAuth } from "./auth";
import { supa } from "./helpers";
import { DeviceModel, GroupModel, MemberModel, ContentModel, JobModel, FileModel } from "./interfaces";
import { Msg } from "../helpers/Msg";
import { getEmails } from "./rpc";

export interface ModelBase<T = number> {
    id: T;
    created_at: Date;
    updated_at: Date;
}

export class RepoError extends Error {
    response: any;

    constructor(response: any) {
        super(String(response.error || response));
        this.response = response;
        console.warn('RepoError', response.error, response);
    }
}

// const _toPromise = <T>(p: any, onNull: () => T) => {
//     return new Promise<T>((resolve, reject) => {
//         p.then((response: any) => {
//             if (response.error) {
//                 reject(new RepoError(response))
//             }
//             else {
//                 try {
//                     resolve((response.data || onNull()) as T)
//                 }
//                 catch (err) {
//                     reject(err)
//                 }
//             }
//         })
//         if (p.catch) p.catch((error: any) => reject(new RepoError(error)))
//     })
// }

const _toColumnsString = <T extends Model = any>(columns?: Columns<T>) => (
    typeof columns === 'string' ? columns :
        Array.isArray(columns) ? columns.join(',') :
            '*'
)

const _addFilter = <T extends Model = any>(query: Select<T>, filter?: Filter<T>) => {
    if (filter) {
        if (typeof filter === 'function') {
            filter(query);
        } else if (Array.isArray(filter)) {
            for (const f of filter) {
                _addFilter(query, f);
            }
        } else {
            for (const key in filter) {
                const value = filter[key] as any;
                if (value === null) query.is(key, null);
                else query.eq(key, filter[key] as any)
            }
        }
    }
    return query;
}

type _Partial<T> = { [P in keyof T]?: T[P]|null; };
export type From<T extends Model = any> = ReturnType<typeof supabase.from<any, T>>
export type Select<T extends Model = any> = ReturnType<From<T>['select']>
export type FilterItem<T extends Model = any> = _Partial<T> | ((query: Select<T>) => any) | undefined | null
export type Filter<T extends Model = any> = FilterItem<T> | FilterItem<T>[] | undefined | null
export type Columns<T extends Model = any> = string | (keyof T)[] | undefined | null
export type Update<T extends Model = any> = Partial<T>;
export type Insert<T extends Model = any> = Omit<T, keyof Model> & Partial<Model>


export class Repo<T extends Model> {
    selectId$ = new Msg<string>('');
    select$ = new Msg<T|null>(null);
    items$ = new Msg<Record<string, T>>({});

    // item$Map: Record<string, Msg<JobModel>> = {};
    // getItem$(jobId: string) {
    //     return item$Map[jobId];
    // }
    // getItem$(job: JobModel) {
    //     let job$ = _jobMsgById[job.id];
    //     if (!job$) {
    //         job$ = new Msg(job);
    //         _jobMsgById[job.id] = job$;
    //         job$.on(job => _jobById$.merge({ [job.id]: job }));
    //     }
    //     return job$;
    // }

    constructor(public schema: string) {
        this.selectId$.on(async (selectId) => {
            this.select$.set(null);
            if (!selectId) return;

            const listItem = this.items$.v[selectId];
            this.select$.set(listItem);

            const item = await this.get(selectId);
            this.select$.set(item);
        });
    }

    lastResponse: any;

    from(): From<T> {
        return supabase.from(this.schema);
    }

    select(columns?: Columns<T>): Select<T> {
        return this.from().select(_toColumnsString(columns));
    }

    sync(id: string, changes: Update<T>|null, _columns: Columns<T>) {
        this.items$.next(prev => {
            const next = { ...prev };
            if (changes) next[id] = { ...next[id], ...changes, id };
            else deleteKey(next, id);
            return next;
        });
    }

    async load(columns?: Columns<T>) {
        const items = await this.list(undefined, columns);
        this.items$.set(byId(items));
    }

    async list(filter?: Filter<T>, columns?: Columns<T>, limit = 1000): Promise<T[]> {
        await checkAuth();
        return supa<any[]>(`${this.schema}.list`, () => (
            _addFilter(this.select(columns), filter).limit(limit)
        ), () => []);
    }

    async find(filter: Filter<T>, columns?: Columns<T>) {
        await checkAuth();
        const item = await supa<T|null>(`${this.schema}.find`, () => (
            _addFilter(this.select(columns), filter).maybeSingle()
        ), () => null);
        if (item?.id) this.sync(item.id, item, columns);
        return item;
    }

    async get(id: string, columns?: Columns<T>) {
        if (!id) throw new Err('no id');
        return await this.find({ id } as Partial<T>, columns);
    }

    async create(item: Insert<T>, columns?: Columns<T>) {
        console.debug('insert', this.schema, item, columns);
        await checkAuth();
        const next = await supa<T>(`${this.schema}.create`, () => (
            this.from()
                .insert(item as any)
                .select(_toColumnsString(columns))
                .single()
        ), () => {
            throw toErr('create-no-result');
        });
        this.sync(next.id, next, columns);
        return next;
    }

    async update(id: string, changes?: Update<T>, columns?: Columns<T>) {
        console.debug('update', this.schema, id, changes, columns);
        if (!id) throw new Err('no id');
        if (!changes) changes = {};
        await checkAuth();
        this.sync(id, changes, columns);
        const item = await supa<T>(`${this.schema}.update`, () => (
            this.from()
                .update(changes as any)
                .eq('id', id as any)
                .select(_toColumnsString(columns))
                .single()
        ), () => {
            throw toErr('update-no-result');
        });
        this.sync(id, item, columns);
        return item;
    }

    async delete(id: string): Promise<number | null> {
        console.debug('delete', this.schema, id);
        if (!id) throw new Err('no id');
        await checkAuth();
        this.sync(id, null, []);
        return await supa(`${this.schema}.delete`, () => (
            this.from().delete().eq('id', id as any)
        )).then((data: any) => toNbr(data.count, null));
    }
}

export const memberRepo = new Repo<MemberModel>('members');
export const groupRepo = new Repo<GroupModel>('groups');
export const deviceRepo = new Repo<DeviceModel>('devices');
export const contentRepo = new Repo<ContentModel>('contents');
export const jobRepo = new Repo<JobModel>('jobs');
export const fileRepo = new Repo<FileModel>('files');

export const members$ = memberRepo.items$;
export const groups$ = groupRepo.items$;
export const devices$ = deviceRepo.items$;
export const contents$ = contentRepo.items$;
export const jobs$ = jobRepo.items$;
export const files$ = fileRepo.items$;

export const memberId$ = memberRepo.selectId$;
export const groupId$ = groupRepo.selectId$;
export const deviceId$ = deviceRepo.selectId$;
export const contentId$ = contentRepo.selectId$;
export const jobId$ = jobRepo.selectId$;
export const fileId$ = fileRepo.selectId$;

export const member$ = memberRepo.select$;
export const group$ = groupRepo.select$;
export const device$ = deviceRepo.select$;
export const content$ = contentRepo.select$;
export const job$ = jobRepo.select$;
export const file$ = fileRepo.select$;

const setGroupId = (item?: { group_id?: string }|null) => {
    const groupId = item?.group_id;
    if (groupId) groupId$.set(groupId);
}

member$.on(setGroupId);
device$.on(setGroupId);
content$.on(setGroupId);
job$.on(setGroupId);

export const emails$ = new Msg<Record<string, string>>({});
members$.on(async (members) => {
    emails$.set({});
    const userIds = Object.values(members).map(m => m.user_id);
    const emails = await getEmails(userIds);
    emails$.set(byId(emails, e => e.email))
});




// const content$ = new Msg<ContentModel|null>(null);
//     // useEffect(() => {
//     //     if (contentId && auth) {
//     //         console.debug('ContentPage get', contentId);
//     //         contentRepo.get(contentId).then(content => {
//     //             console.debug('ContentPage get content', contentId, content);
//     //             content$.set(content);
//     //             groupId$.set(content?.group_id||'');
//     //         });
//     //     }
//     // }, [contentId, auth]);