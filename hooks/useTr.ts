import { setTemplate } from '../utils/str';
import { Msg } from '../utils/Msg';
import { useMsg } from './useMsg';

export const translateByKey$ = new Msg<Record<string, string>>({});

export function addTranslates(changes: Record<string, string>) {
  // console.debug('addTranslates', changes);
  const translateByKey = { ...translateByKey$.v };
  Object.assign(translateByKey, changes);
  // console.debug('addTranslates translateByKey', translateByKey);
  translateByKey$.set(translateByKey);
}

export const tr = (key: any, params?: Record<string, string>): any => {
  const translateByKey = translateByKey$.v;
  if (typeof key !== 'string') {
    if (key instanceof Error) {
      const errorString = String(key);
      if (errorString in translateByKey) return tr(errorString);
      const { message } = key;
      if (message in translateByKey) return tr(message);
      const { name } = key;
      if (name in translateByKey) return tr(name);
      return message;
    }
    return key;
  }
  const translate = translateByKey[key] || key;
  return params ? setTemplate(translate, params) : translate;
};

export const useTr = () => {
  useMsg(translateByKey$);
  return tr;
};
