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
  const [state, setState] = useState(() => coll.findCache(where));

  useEffect(() => coll.on(), [coll]);
  useEffect(() => {
    setState(coll.findCache(where));
    coll.find$(where).on(setState);
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

export const useQueryOne = <K extends keyof Models>(
  coll: CollSync<K, Models[K]>,
  where?: string|CollWhere<Models[K]>
) => {
  const [state, setState] = useState(() => coll.getCache(where));

  useEffect(() => coll.on(), [coll]);
  useEffect(() => {
    setState(coll.getCache(where));
    coll.one$(where).on(setState);
  }, [coll, stringify(where)]);

  return state;
};
