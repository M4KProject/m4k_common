///// file generated in n8n /////

import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://prod.m4k.fr';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQyOTk2NDExLCJleHAiOjE4NDI5OTY0MTF9.ZrHQ3c5bPtL018UT0l0qgvwYmMPE0aksoVnCTa3H9Ws';
export const supabase = createClient(SUPABASE_URL, ANON_KEY)
export type Supabase = typeof supabase

export interface Model {
  id: string;
  created: string;
  updated: string;
}

export interface _MemberModel extends Model {
  role: string; // USER-DEFINED
  user_id: string; // uuid
  group_id: string; // uuid
}

export interface _FileModel extends Model {
  type: string; // text
  name: string; // text
  title: string; // text
  storage: string; // text
  size?: number; // bigint
  info: any; // jsonb
  owner_id?: string; // uuid
  group_id?: string; // uuid
  parent_id?: string; // uuid
}

export interface _ContentModel extends Model {
  public?: boolean; // boolean
  key?: string; // text
  title?: string; // text
  type?: string; // text
  data?: any; // jsonb
  meta?: any; // jsonb
  owner_id?: string; // uuid
  group_id?: string; // uuid
  parent_id?: string; // uuid
}

export interface _GroupModel extends Model {
  name?: string; // text
  desc?: string; // text
  owner_id?: string; // uuid
}

export interface _DeviceModel extends Model {
  started?: string; // timestamp with time zone
  online?: string; // timestamp with time zone
  name?: string; // text
  type?: string; // text
  info?: string; // text
  width?: number; // integer
  height?: number; // integer
  action?: string; // text
  status?: string; // text
  input?: any; // jsonb
  result?: any; // jsonb
  user_id?: string; // uuid
  group_id?: string; // uuid
}

export interface _JobModel extends Model {
  status?: string; // text
  progress?: number; // integer
  action?: string; // text
  input?: any; // jsonb
  error?: string; // text
  result?: any; // jsonb
  user_id?: string; // uuid
  group_id?: string; // uuid
}
