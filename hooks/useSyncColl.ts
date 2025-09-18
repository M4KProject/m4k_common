import { ModelBase } from '@common/api/models.base';
import { SyncColl } from '@common/api/SyncColl';
import { useEffect } from 'preact/hooks';
import { useMsg } from './useMsg';
import { groupId$ } from '@common/api/messages';
import { search$ } from '@/admin/messages';
import { isSearched } from '@common/utils/str';
import { stringify } from '@common/utils/json';

export const useSyncColl = <T extends ModelBase>(syncColl: SyncColl<T>) => {
  useEffect(() => syncColl.subscribe(), []);
  const groupId = useMsg(groupId$);
  const search = useMsg(search$);
  const byId = useMsg(syncColl.byId$);
  let items = Object.values(byId);
  if (groupId) items = items.filter((m: any) => !m.group || m.group === groupId);
  if (search) items = items.filter((item) => isSearched(stringify(item), search));
  return items;
};
