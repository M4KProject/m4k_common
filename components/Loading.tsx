import { Css } from '@common/ui/css';

import { DivProps } from './Div';
import { Tr } from './Tr';
import { RotateCcw } from 'lucide-react';

import { addTr } from '../hooks/useTr';

const c = Css('Loading', {
  '': {
    w: '100%',
    h: '100%',
    fCenter: 1,
  },
  Content: {
    ml: 0.5,
  },

  Spinner: {
    fCenter: 1,
  },
  SpinnerCircle: {
    w: 5,
    h: 5,
    bg: 'p5',
    rounded: 50,
    fCenter: 1,
  },
  SpinnerIcon: {
    w: 2.5,
    h: 2.5,
    border: '3px solid',
    bColor: 'w1',
    borderTop: '3px solid transparent',
    rounded: 50,
    anim: {
      name: 'spin',
      duration: '1s',
      timing: 'linear',
      count: 'infinite',
      keyframes: {
        '0%': { transform: { rotate: 0 } },
        '100%': { transform: { rotate: 360 } },
      },
    },
  },
});

addTr({
  loading: 'Chargement...',
});

export const LoadingSpinner = (props: DivProps) => (
  <div {...props} class={c('Spinner', props)}>
    <div {...props} class={c('SpinnerCircle', props)}>
      <div class={c('SpinnerIcon')} />
    </div>
  </div>
);

export const Loading = ({ content, children, ...props }: DivProps & { content?: string }) => {
  return (
    <div {...props} class={c('', props)}>
      <LoadingSpinner />
      {content !== '' && (
        <div class={c('Content')}>
          <Tr>{content || 'loading'}</Tr>
        </div>
      )}
      {children}
    </div>
  );
};
