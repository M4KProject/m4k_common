import { CollSync, groupId$ } from '@common/api';
import { CollWhere } from '@common/api/Coll';
import { Models } from '@common/api/models';
import { stringify } from '@common/utils';
import { useEffect, useState } from 'preact/hooks';
import { useMsg } from './useMsg';

export const useQuery = <K extends keyof Models>(
  coll: CollSync<K, Models[K]>,
  where?: CollWhere<Models[K]>
) => {
  const [state, setState] = useState([] as Models[K][]);

  useEffect(() => {
    const refresh = () => {
      const items = coll.findCache(where);
      console.debug('useQuery refresh', coll.name, where, items);
      setState(items);
    };

    refresh();
    coll.find(where).then(refresh);

    const off = coll.on();
    const off2 = coll.cache.throttle(50).on(refresh);

    return () => {
      off();
      off2();
    };
  }, [coll, stringify(where)]);

  return state;
};

export const useGroupQuery = <K extends keyof Models>(
  coll: CollSync<K, Models[K]>,
  where?: CollWhere<Models[K]>
) => {
  const group = useMsg(groupId$);
  return useQuery(coll, { ...where, group });
};
