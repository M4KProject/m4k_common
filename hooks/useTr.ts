import { setTemplate } from '@common/utils/str';
import { useMsg } from './useMsg';
import { MsgDict } from '@common/utils';

export const tr$ = new MsgDict<string>({});

export function addTr(changes: Dictionary<string>) {
  tr$.update(changes);
}

export const tr = (key: any, params?: Dictionary<string>): any => {
  const translateByKey = tr$.v;
  key = String(key);
  const translate = translateByKey[key] || key;
  return params ? setTemplate(translate, params) : translate;
};

export const useTr = () => {
  useMsg(tr$);
  return tr;
};
