import { Css } from '@common/ui/css';
import { DivProps } from './types';

const c = Css('Page', {
  '': {
    fCol: [],
    flex: 1,
    position: 'relative',
  },
  Container: {
    fCol: [],
    overflowY: 'auto',
    bg: 'b2',
    p: 0.5,
    flex: 1,
  },
  Section: {
    flex: 1,
    fCol: [],
    position: 'relative',
    bg: 'b0',
    m: 0.5,
    rounded: 2,
    elevation: 2,
  },
});

// export interface PageActionsProps extends DivProps {}
// export const PageActions = (props: PageActionsProps) => {
//   return <div {...props} class={c('Actions', props)} />;
// };

export const Page = (props: DivProps) => <div {...props} class={c('', props)} />;

export const PageSection = (props: DivProps) => <div {...props} class={c('Section', props)} />;

export const PageContainer = (props: DivProps) => <div {...props} class={c('Container', props)} />;

export const PageBody = ({ children, ...props }: DivProps) => (
  <PageContainer {...props}>
    <PageSection>{children}</PageSection>
  </PageContainer>
);
