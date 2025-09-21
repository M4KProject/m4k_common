import { Css } from '@common/ui/html';

import { DivProps } from './Div';
import { Tr } from './Tr';
import { RotateCcw } from 'lucide-react';
import { flexCenter } from '@common/ui/flexBox';
import { addTranslates } from '../hooks/useTr';

const c = Css('Loading', {
  '&': {
    w: '100%',
    h: '100%',
    ...flexCenter(),
  },
  '& svg': {
    fontSize: 1.2,
    // anim: {
    //     count: 'infinite',
    //     timing: 'linear',
    //     duration: '2s',
    //     keyframes: {
    //         from: { transform: { rotate: 360 } },
    //         to: { transform: { rotate: 0 } },
    //     }
    // }
  },
  '&Content': {
    ml: 0.5,
  },
});

addTranslates({
  loading: 'Chargement...',
});

export const Loading = ({ content, children, ...props }: DivProps & { content?: string }) => {
  return (
    <div {...props} class={c('', props)}>
      <RotateCcw />
      {content !== '' && (
        <div class={c('Content')}>
          <Tr>{content || 'loading'}</Tr>
        </div>
      )}
      {children}
    </div>
  );
};
