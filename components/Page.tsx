import { flexColumn, flexRow } from '@common/ui/flexBox';
import { Css } from '@common/ui/html';

import { DivProps } from './Div';
import { Tr } from './Tr';
import { ComponentChildren } from 'preact';

const c = Css('Page', {
  '': {
    ...flexColumn({ align: 'stretch', justify: 'start' }),
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    bg: '#eee',
  },
  Header: {
    ...flexRow({ align: 'center', justify: 'around' }),
    bg: 'headerBg',
    mt: 1,
    h: 3,
  },
  HeaderTitle: {
    ...flexRow({ align: 'center' }),
    fontSize: 1.4,
    fg: 'headerTitle',
  },
  HeaderContent: {
    ...flexRow({ align: 'center' }),
  },
  Actions: {
    ...flexRow({ align: 'center', justify: 'around' }),
  },
  Body: {
    ...flexColumn({ align: 'stretch', justify: 'start' }),
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    flex: 1,
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

export interface PageHeaderProps extends Omit<DivProps, 'title'> {
  title: ComponentChildren;
}
export const PageHeader = ({ title, children, ...props }: PageHeaderProps) => {
  return (
    <div {...props} class={c('Header', props)}>
      <div class={c('HeaderTitle')}>
        <Tr>{title}</Tr>
      </div>
      <div class={c('HeaderContent')}>{children}</div>
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
