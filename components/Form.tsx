import { Css } from '@common/ui/css';
import { getStyle } from './Div';
import { JSX } from 'preact/jsx-runtime';

const c = Css('Form', {
  '': {
    fCol: ['stretch'],
    m: 1,
    p: 1,
  },
  Title: {
    fCol: ['start', 'end'],
    py: 0.5,
    color: 'p8',
    bold: 1,
    // borderBottom: '1px solid #0a536f',
  },
});

type FormHTMLProps = JSX.HTMLAttributes<HTMLFormElement>;
export interface FormProps extends Omit<FormHTMLProps, 'style'> {
  class?: string;
  style?: string | JSX.CSSProperties | undefined;
}

export const Form = ({ style, className, children, title, onSubmit, ...props }: FormProps) => {
  return (
    <form
      {...props}
      style={getStyle(style)}
      class={c('', props)}
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
      }}
    >
      {title && <div class={c('Title')}>{title}</div>}
      {children}
    </form>
  );
};
