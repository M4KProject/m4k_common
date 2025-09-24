import { Css } from '@common/ui/css';
import { DivProps } from './Div';

const c = Css('Page', {
  '': {
    fCol: 1,
    flex: 1,
    position: 'relative',
    bg: '#eee',
  },
  Actions: {
    fRow: ['center', 'space-around'],
  },
  Body: {
    fCol: 1,
    position: 'relative',
    overflowY: 'auto',
    flex: 1,
    bg: 'body',
  },
});

export interface PageProps extends DivProps {}
export const Page = ({ children, ...props }: PageProps) => {
  return (
    <div {...props} class={c('', props)}>
      {children}
    </div>
  );
};

export interface PageActionsProps extends DivProps {}
export const PageActions = (props: PageActionsProps) => {
  return <div {...props} class={c('Actions', props)} />;
};

export interface PageBodyProps extends DivProps {}
export const PageBody = ({ children, ...props }: PageBodyProps) => {
  return (
    <div {...props} class={c('Body', props)}>
      {children}
    </div>
  );
};
