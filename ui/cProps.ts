import { isItem, isList, isObj, isStr } from '@common/utils/check';
import { JSX } from 'preact/jsx-runtime';

type SVal = string | JSX.CSSProperties | undefined | null | false;
export type S = SVal | S[];

type CVal = string | undefined | null | false;
export type C = CVal | C[];

const getStyle = (s: S): JSX.CSSProperties => {
  if (isItem(s)) {
    return s as JSX.CSSProperties;
  }
  if (isStr(s)) {
    const styleObject: Record<string, string> = {};
    s.split(';').forEach((declaration) => {
      const [property, value] = declaration.split(':');
      if (property && value) {
        const camelCaseProp = property.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        styleObject[camelCaseProp] = value.trim();
      }
    });
    return styleObject as JSX.CSSProperties;
  }
  if (isList(s)) {
    return Object.assign({}, ...s.map(getStyle));
  }
  return {};
};

const getClassName = (...cs: any[]) => {
  const sb: string[] = [];
  for (const c of cs) {
    if (c) {
      if (typeof c === 'string') sb.push(c);
      else if (isList(c)) {
        const cls = getClassName(...c);
        if (cls) sb.push(cls);
      }
    }
  }
  return sb.join(' ') || undefined;
};

type PropsBase = {
  style?: any;
  class?: any;
  className?: any;
};

export type CProps<T extends PropsBase> = Omit<T, 'style' | 'class' | 'className'> & {
  c?: C;
  cls?: C;
  class?: C;
  className?: C;
  s?: S;
  style?: S;
};

export interface DivProps extends CProps<JSX.HTMLAttributes<HTMLDivElement>> {}

export const cProps = <T extends PropsBase>(props: CProps<T>) => {
  const { c, class: className0, className, s, style, ...rest } = props;
  const result = rest as T;
  result.style = getStyle([s, style]);

  return props as T;
};
