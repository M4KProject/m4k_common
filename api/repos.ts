import { Err, toErr } from "../helpers/err";
import { AssetModel, DeviceModel, GroupModel, MemberModel, Model, supabase } from "./_generated";
import { checkAuth } from "./auth";

export interface ModelBase<T = number> {
    id: T;
    created_at: Date;
    updated_at: Date;
}

export class RepoError extends Error {
    response: any;

    constructor(response) {
        super(String(response.error || response));
        this.response = response;
        console.warn('RepoError', response.error, response);
    }
}

const _toPromise = <T>(p: any) => {
    return new Promise<T | null>((resolve, reject) => {
        p.then(response => {
            if (response.error) reject(new RepoError(response))
            else resolve((response.data || null) as T | null)
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

const _checkAuth = async () => {
    supabase.auth
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

    async filter(filter: Filter<T>, columns?: Columns<T>, limit = 1000) {
        await checkAuth()
        return _toPromise<T[]>(_addFilter(this.select(columns), filter).limit(limit)).then(items => items || []);
    }

    async find(filter: Filter<T>, columns?: Columns<T>) {
        await checkAuth()
        return _toPromise<T>(_addFilter(this.select(columns), filter).maybeSingle());
    }

    async get(id: string, columns?: Columns<T>) {
        if (!id) throw new Err('no id');
        return this.find({ id } as Partial<T>, columns);
    }

    async insert(item: Omit<T, 'id'>, selectColumns?: Columns<T>) {
        console.debug('insert', this.schema, item, selectColumns);
        await checkAuth()
        return _toPromise<T>(
            this.from()
                .insert(item as any)
                .select(_toColumnsString(selectColumns))
                .single()
        )
    }

    async update(id: string, changes?: Update, selectColumns?: Columns<T>): Promise<T | null> {
        console.debug('update', this.schema, id, changes, selectColumns);
        if (!id) throw new Err('no id');
        await checkAuth()
        return _toPromise<T>(
            this.from()
                .update(changes as any)
                .eq('id', id as any)
                .select(_toColumnsString(selectColumns))
                .single()
        )
    }
}

export const memberRepo = new Repo<MemberModel>('members');
export const groupRepo = new Repo<GroupModel>('groups');
export const deviceRepo = new Repo<DeviceModel>('devices');
export const assetRepo = new Repo<AssetModel>('assets');
