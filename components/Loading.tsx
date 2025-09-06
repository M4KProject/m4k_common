import { Css } from '../helpers/html';
import { useCss } from '../hooks/useCss';
import { Div, DivProps } from './Div';
import { Tr } from './Tr';
import { RotateCcw } from 'lucide-react';
import { flexCenter } from '../helpers/flexBox';
import { addTranslates } from '../hooks/useTr';

const css: Css = {
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
};

addTranslates({
  loading: 'Chargement...',
});

export const Loading = ({ cls, content, children, ...props }: DivProps & { content?: string }) => {
  const c = useCss('Loading', css);
  return (
    <Div {...props} cls={[c, cls]}>
      <RotateCcw />
      {content !== '' && (
        <Div cls={`${c}Content`}>
          <Tr>{content || 'loading'}</Tr>
        </Div>
      )}
      {children}
    </Div>
  );
};
