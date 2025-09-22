import { Css } from '@common/ui/css';
import { DivProps } from './Div';
import { Tr } from './Tr';

const c = Css('Toolbar', {
  '': {
    bg: 'toolbar',
    px: 1,
    my: 0,
    elevation: 1,
    fRow: 1,
  },
  Title: {
    fontSize: 1.4,
    fg: 'headerTitle',
  },
});

export interface ToolbarProps extends DivProps {
  title?: string;
}
export const Toolbar = ({ title, children, ...props }: DivProps) => {
  return (
    <div {...props} class={c('', props)}>
      {title && (
        <div class={c('Title')}>
          <Tr>{title}</Tr>
        </div>
      )}
      {children}
    </div>
  );
};
