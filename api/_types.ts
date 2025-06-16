/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Contents = "contents",
	Devices = "devices",
	Files = "files",
	Groups = "groups",
	Jobs = "jobs",
	Members = "members",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export enum ContentsTypeOptions {
	"form" = "form",
}
export type ContentsRecord<Tdata = unknown> = {
	created?: IsoDateString
	data?: null | Tdata
	dependencies?: RecordIdString[]
	group?: RecordIdString
	id: string
	key?: string
	public?: boolean
	title?: string
	type?: ContentsTypeOptions
	updated?: IsoDateString
}

export enum DevicesActionOptions {
	"reload" = "reload",
}

export enum DevicesStatusOptions {
	"started" = "started",
}
export type DevicesRecord = {
	action?: DevicesActionOptions
	created?: IsoDateString
	group?: RecordIdString
	height?: number
	id: string
	input?: string
	ip?: string
	key?: string
	model?: string
	name?: string
	online?: IsoDateString
	result?: string
	started?: IsoDateString
	status?: DevicesStatusOptions
	type?: string
	updated?: IsoDateString
	user?: RecordIdString
	version?: number
	webview?: string
	width?: number
}

export enum FilesStatusOptions {
	"pending" = "pending",
}
export type FilesRecord = {
	created?: IsoDateString
	formats?: string[]
	group?: RecordIdString
	height?: number
	id: string
	owner?: RecordIdString
	path?: string
	size?: number
	source?: string
	status?: FilesStatusOptions
	title?: string
	type?: string
	updated?: IsoDateString
	width?: number
}

export type GroupsRecord = {
	created?: IsoDateString
	id: string
	key?: string
	name?: string
	owner?: RecordIdString
	updated?: IsoDateString
}

export enum JobsStatusOptions {
	"pending" = "pending",
}

export enum JobsActionOptions {
	"test" = "test",
}
export type JobsRecord<Tinput = unknown, Tresult = unknown> = {
	action?: JobsActionOptions
	created?: IsoDateString
	error?: string
	group?: RecordIdString
	id: string
	input?: null | Tinput
	progress?: number
	result?: null | Tresult
	status?: JobsStatusOptions
	updated?: IsoDateString
	user?: RecordIdString
}

export enum MembersRoleOptions {
	"none" = "none",
	"viewer" = "viewer",
	"editor" = "editor",
	"admin" = "admin",
}
export type MembersRecord = {
	created?: IsoDateString
	group?: RecordIdString
	id: string
	role?: MembersRoleOptions
	updated?: IsoDateString
	user?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ContentsResponse<Tdata = unknown, Texpand = unknown> = Required<ContentsRecord<Tdata>> & BaseSystemFields<Texpand>
export type DevicesResponse<Texpand = unknown> = Required<DevicesRecord> & BaseSystemFields<Texpand>
export type FilesResponse<Texpand = unknown> = Required<FilesRecord> & BaseSystemFields<Texpand>
export type GroupsResponse<Texpand = unknown> = Required<GroupsRecord> & BaseSystemFields<Texpand>
export type JobsResponse<Tinput = unknown, Tresult = unknown, Texpand = unknown> = Required<JobsRecord<Tinput, Tresult>> & BaseSystemFields<Texpand>
export type MembersResponse<Texpand = unknown> = Required<MembersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	contents: ContentsRecord
	devices: DevicesRecord
	files: FilesRecord
	groups: GroupsRecord
	jobs: JobsRecord
	members: MembersRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	contents: ContentsResponse
	devices: DevicesResponse
	files: FilesResponse
	groups: GroupsResponse
	jobs: JobsResponse
	members: MembersResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'contents'): RecordService<ContentsResponse>
	collection(idOrName: 'devices'): RecordService<DevicesResponse>
	collection(idOrName: 'files'): RecordService<FilesResponse>
	collection(idOrName: 'groups'): RecordService<GroupsResponse>
	collection(idOrName: 'jobs'): RecordService<JobsResponse>
	collection(idOrName: 'members'): RecordService<MembersResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
