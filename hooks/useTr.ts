import { setTemplate } from '@common/utils/str';
import { useMsg } from './useMsg';
import { MsgMap } from '@common/utils';
import { TMap } from '@common/utils/types';

export const tr$ = new MsgMap<string>({});

export function addTr(changes: TMap<string>) {
  tr$.update(changes);
}

export const tr = (key: any, params?: TMap<string>): any => {
  const translateByKey = tr$.v;
  key = String(key);
  const translate = translateByKey[key] || key;
  return params ? setTemplate(translate, params) : translate;
};

export const useTr = () => {
  useMsg(tr$);
  return tr;
};
