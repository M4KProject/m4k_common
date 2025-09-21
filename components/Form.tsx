import { clsx, Css } from '@common/ui/html';

import { flexColumn } from '@common/ui/flexBox';
import { Div, getStyle } from './Div';
import { JSX } from 'preact/jsx-runtime';

const css = Css('Form', {
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
});

type FormHTMLProps = JSX.HTMLAttributes<HTMLFormElement>;
export interface FormProps extends Omit<FormHTMLProps, 'style'> {
  cls?: any;
  style?: string | JSX.CSSProperties | undefined;
}

export const Form = ({ cls, style, className, children, title, onSubmit, ...props }: FormProps) => {
  return (
    <form
      {...props}
      style={getStyle(style)}
      class={clsx(css(), cls, className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
      }}
    >
      {title && <Div cls={css(`Title`)}>{title}</Div>}
      {children}
    </form>
  );
};
