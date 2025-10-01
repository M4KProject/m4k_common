import { Css } from '@common/ui/css';
import { DivProps } from './types';
import { Tr } from './Tr';

const c = Css('Toolbar', {
  '': {
    bg: 'b1',
    fg: 't3',
    px: 2,
    my: 0,
    elevation: 2,
    fRow: 1,
    h: 4,
    zIndex: 20,
  },
  Title: {
    fg: 't2',
    flex: 1,
    bold: 1,
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
