import { clsx, Css } from '../helpers/html';
import { useCss } from '../hooks/useCss';
import { flexColumn } from '../helpers/flexBox';
import { Div, getStyle } from './Div';
import { JSX } from 'preact/jsx-runtime';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    m: 0.5,
    p: 1,
    elevation: 1,
    border: '1px solid #eee',
    bg: 'white',
    rounded: 1,
  },
  '&Title': {
    ...flexColumn({ align: 'start', justify: 'end' }),
    py: 0.5,
    color: '#0a536f',
    fontWeight: 'bold',
    // borderBottom: '1px solid #0a536f',
  },
};

type FormHTMLProps = JSX.HTMLAttributes<HTMLFormElement>;
export interface FormProps extends Omit<FormHTMLProps, 'style'> {
  cls?: any;
  style?: string | JSX.CSSProperties | undefined;
}

export const Form = ({ cls, style, className, children, title, onSubmit, ...props }: FormProps) => {
  const c = useCss('Form', css);
  return (
    <form
      {...props}
      style={getStyle(style)}
      class={clsx(c, cls, className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
      }}
    >
      {title && <Div cls={`${c}Title`}>{title}</Div>}
      {children}
    </form>
  );
};
