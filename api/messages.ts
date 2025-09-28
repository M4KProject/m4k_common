import { toError } from '@common/utils/cast';
import { Msg } from '@common/utils/Msg';
import { isStr,isStrDef } from '@common/utils/check';

// export const PB_URL_DEV = "http://127.0.0.1:8090/api/";

export const groupId$ = new Msg<string>('', 'groupId', true, isStr);

export const getGroupId = () => groupId$.v;

export const needGroupId = () => {
  const id = getGroupId();
  if (!isStrDef(id)) throw toError('no group id');
  return id;
};
