import { clsx } from '../ui/html';
import { JSX } from 'preact';

type DivHTMLProps = JSX.HTMLAttributes<HTMLDivElement>;
export interface DivProps extends Omit<DivHTMLProps, 'style'> {
  cls?: any;
  style?: string | JSX.CSSProperties | undefined;
}

export const getStyle = (
  style: string | JSX.CSSProperties | undefined
): JSX.CSSProperties | undefined => {
  if (typeof style === 'string') {
    const styleObject: Record<string, string> = {};
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

export const Div = ({ cls, style, className, children, ...props }: DivProps) => (
  <div {...props} style={getStyle(style)} class={clsx(cls, className)}>
    {children}
  </div>
);
