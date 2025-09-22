import { Css } from '@common/ui/html';
import { DivProps } from './Div';

const c = Css('Page', {
  '': {
    fCol: 1,
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    bg: '#eee',
  },
  Actions: {
    fRow: ['center', 'space-around'],
  },
  Body: {
    fCol: 1,
    position: 'relative',
    overflowX: 'hidden',
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
