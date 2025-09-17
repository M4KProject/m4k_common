import { flexColumn, flexRow } from '../ui/flexBox';
import { Css } from '../ui/html';
import { useCss } from '../hooks/useCss';
import { Div, DivProps } from './Div';
import { Tr } from './Tr';
import { ComponentChildren } from 'preact';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch', justify: 'start' }),
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    bg: '#eee',
  },
  '&Header': {
    ...flexRow({ align: 'center', justify: 'around' }),
    bg: 'headerBg',
    mt: 1,
  },
  '&HeaderTitle': {
    ...flexRow({ align: 'center' }),
    fontSize: 1.4,
    fg: 'headerTitle',
  },
  '&HeaderContent': {
    ...flexRow({ align: 'center' }),
  },
  '&Actions': {
    ...flexRow({ align: 'center', justify: 'around' }),
  },
  '&Body': {
    ...flexColumn({ align: 'stretch', justify: 'start' }),
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    flex: 1,
  },
};

export interface PageProps extends DivProps {}
export const Page = ({ cls, children, ...props }: PageProps) => {
  const c = useCss('Page', css);
  return (
    <Div cls={[c, cls]} {...props}>
      {children}
    </Div>
  );
};

export interface PageHeaderProps extends Omit<DivProps, 'title'> {
  title: ComponentChildren;
}
export const PageHeader = ({ cls, title, children, ...props }: PageHeaderProps) => {
  const c = useCss('Page', css);
  return (
    <Div cls={[`${c}Header`, cls]} {...props}>
      <Div cls={`${c}HeaderTitle`}>
        <Tr>{title}</Tr>
      </Div>
      <Div cls={`${c}HeaderContent`}>{children}</Div>
    </Div>
  );
};

export interface PageActionsProps extends DivProps {}
export const PageActions = (props: PageActionsProps) => {
  const c = useCss('Page', css);
  return <Div {...props} cls={[`${c}Actions`, props.cls]} />;
};

export interface PageBodyProps extends DivProps {}
export const PageBody = ({ cls, children, ...props }: PageBodyProps) => {
  const c = useCss('Page', css);
  return (
    <Div cls={[`${c}Body`, cls]} {...props}>
      {children}
    </Div>
  );
};
