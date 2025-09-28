import { TMap } from '@common/utils/types';
import { JSX } from 'preact';

type DivHTMLProps = JSX.HTMLAttributes<HTMLDivElement>;
export interface DivProps extends Omit<DivHTMLProps, 'style'> {
  class?: string;
  style?: JSX.CSSProperties;
}

export const getStyle = (
  style: string | JSX.CSSProperties | undefined
): JSX.CSSProperties | undefined => {
  if (typeof style === 'string') {
    const styleObject: TMap<string> = {};
    style.split(';').forEach((declaration) => {
      const [property, value] = declaration.split(':');
      if (property && value) {
        const camelCaseProp = property.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        styleObject[camelCaseProp] = value.trim();
      }
    });
    return styleObject as JSX.CSSProperties;
  }
  return style;
};
