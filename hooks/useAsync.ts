import { useMemo, useEffect } from 'preact/hooks';
import { Msg } from '@common/utils/Msg';
import { useMsg } from './useMsg';
import { toErr } from '@common/utils';

export const useAsync = <T>(
  initValue: T,
  load: () => T | Promise<T>,
  storedKey?: string | null,
  deps?: any[]
): [T, () => void, Msg<T>] => {
  const _deps = deps ? [...deps, storedKey] : [storedKey];

  // import { isList, isDefined } from "@common/utils/check";
  // const msg = useMemo(() => {
  //     const msg = new Msg<T>(initValue, storedKey, !!storedKey);
  //     if (isDefined(initValue) && (typeof msg.v !== typeof initValue || isList(msg.v) !== isList(initValue))) {
  //         msg.set(initValue);
  //     }
  //     return msg;
  // }, _deps);

  const msg = useMemo(() => new Msg<T>(initValue, storedKey || undefined, !!storedKey), _deps);

  const reload = async () => {
    const value = await load();
    msg.set(value);
  };

  useEffect(() => {
    reload().catch((e) => {
      const error = toErr(e);
      console.error('useAsync load', storedKey, error);
      if (!storedKey) throw error;
    });
  }, _deps);

  const value = useMsg(msg);

  return [value, reload, msg];
};
