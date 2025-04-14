import { Err, toErr } from "../helpers/err";
import { Model, supabase } from "./_generated";
import { checkAuth } from "./auth";
import { DeviceModel, GroupModel, MemberModel, ContentModel } from "./interfaces";

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

const _toPromise = <T>(p: any, onNull: () => T) => {
    return new Promise<T>((resolve, reject) => {
        p.then((response: any) => {
            if (response.error) {
                reject(new RepoError(response))
            }
            else {
                try {
                    resolve((response.data || onNull()) as T)
                }
                catch (err) {
                    reject(err)
                }
            }
        })
        if (p.catch) p.catch((error: any) => reject(new RepoError(error)))
    })
}

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
                query.eq(key, filter[key] as any)
            }
        }
    }
    return query;
}

export type From<T extends Model = any> = ReturnType<typeof supabase.from<any, T>>
export type Select<T extends Model = any> = ReturnType<From<T>['select']>
export type FilterItem<T extends Model = any> = Partial<T> | ((query: Select<T>) => any) | undefined | null
export type Filter<T extends Model = any> = FilterItem<T> | FilterItem<T>[] | undefined | null
export type Columns<T extends Model = any> = string | (keyof T)[] | undefined | null
export type Update<T extends Model = any> = Partial<T>;
export type Insert<T extends Model = any> = Omit<T, keyof Model> & Partial<Model>

export class Repo<T extends Model> {
    constructor(public schema: string) { }

    lastResponse: any;

    from(): From<T> {
        return supabase.from(this.schema)
    }

    select(columns?: Columns<T>): Select<T> {
        return this.from().select(_toColumnsString(columns));
    }

    async list(filter?: Filter<T>, columns?: Columns<T>, limit = 1000) {
        await checkAuth()
        return _toPromise<T[]>(_addFilter(this.select(columns), filter).limit(limit), () => []);
    }

    async find(filter: Filter<T>, columns?: Columns<T>) {
        await checkAuth()
        return _toPromise<T|null>(_addFilter(this.select(columns), filter).maybeSingle(), () => null);
    }

    async get(id: string, columns?: Columns<T>) {
        if (!id) throw new Err('no id');
        return this.find({ id } as Partial<T>, columns);
    }

    async create(item: Insert<T>, selectColumns?: Columns<T>) {
        console.debug('insert', this.schema, item, selectColumns);
        await checkAuth()
        return _toPromise<T>(
            this.from()
                .insert(item as any)
                .select(_toColumnsString(selectColumns))
                .single(),
            () => {
                throw toErr('create-no-result');
            }
        )
    }

    async update(id: string, changes?: Update, selectColumns?: Columns<T>) {
        console.debug('update', this.schema, id, changes, selectColumns);
        if (!id) throw new Err('no id');
        await checkAuth()
        return _toPromise<T>(
            this.from()
                .update(changes as any)
                .eq('id', id as any)
                .select(_toColumnsString(selectColumns))
                .single(),
            () => {
                throw toErr('update-no-result');
            }
        )
    }

    async delete(id: string): Promise<number | null> {
        console.debug('delete', this.schema, id);
        if (!id) throw new Err('no id');
        await checkAuth()
        return new Promise((resolve, reject) => {
            this.from().delete().eq('id', id as any).then(value => {
                if (value.error) {
                    reject(value.error)
                    return
                }
                resolve(value.count)
            })
        })
    }
}

export const memberRepo = new Repo<MemberModel>('members');
export const groupRepo = new Repo<GroupModel>('groups');
export const deviceRepo = new Repo<DeviceModel>('devices');
export const contentRepo = new Repo<ContentModel>('contents');
