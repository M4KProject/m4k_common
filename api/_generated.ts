///// file generated in n8n /////

import { createClient } from '@supabase/supabase-js'

const URL = 'https://prod.m4k.fr';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQyOTk2NDExLCJleHAiOjE4NDI5OTY0MTF9.ZrHQ3c5bPtL018UT0l0qgvwYmMPE0aksoVnCTa3H9Ws';
export const supabase = createClient(URL, ANON_KEY)
export type Supabase = typeof supabase

export type Role = 'none'|'viewer'|'editor'|'admin';

export interface Model {
  id: string;
  created: string;
  updated: string;
}

export interface MemberModel extends Model {
  role: Role;
  user_id: string;
  group_id: string;
}

export interface GroupModel extends Model {
  name?: string;
  desc?: string;
  owner_id?: string;
}

export interface DeviceModel extends Model {
  started?: Date;
  online?: Date;
  name?: string;
  type?: string;
  info?: string;
  width?: number;
  height?: number;
  action?: string;
  status?: string;
  input?: any;
  result?: any;
  user_id?: string;
  group_id?: string;
}

export interface AssetModel extends Model {
  status?: string;
  path?: string;
  title?: string;
  mime?: string;
  data?: any;
  public?: boolean;
  owner_id?: string;
  group_id?: string;
  parent_id?: string;
  object_id?: string;
}
