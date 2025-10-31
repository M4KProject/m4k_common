import { Css } from '@common/ui/css';
import { DivProps } from './types';
import { clamp, round } from 'fluxio';
import { toNumber } from 'fluxio';

import { ComponentChildren } from 'preact';

const c = Css('Progress', {
  '': {
    fCenter: [],
    position: 'relative',
    bg: 'b1',
    border: 'primary',
    borderRadius: '0.2em',
    w: '100%',
    overflow: 'hidden',
    h: 1.5,
  },
  Bar: {
    position: 'absolute',
    xy: 0,
    wh: '100%',
    bg: 'primary',
    borderRadius: '0.2em 0 0 0.2em',
    overflow: 'hidden',
    transition: 0.5,
  },
  Text: {
    fCenter: [],
    position: 'absolute',
    xy: 0,
    wh: '100%',
    fg: 't1',
    zIndex: 1,
  },
  'Text-in': {
    fg: 'w1',
    transition: 0.5,
  },
});

export interface ProgressProps extends DivProps {
  step?: ComponentChildren;
  progress?: number | null;
}
export const Progress = ({ progress, step, children, ...props }: ProgressProps) => {
  const prct = clamp(toNumber(progress, 0), 0, 100);
  const text = step ? `${step} ${round(prct)}%` : `${round(prct)}%`;
  return (
    <div {...props} {...c('', props)}>
      <div {...c('Text')}>{text}</div>
      <div {...c('Bar')} style={{ left: prct - 100 + '%' }}>
        <div {...c('Text', 'Text-in')} style={{ left: -(prct - 100) + '%' }}>
          {text}
        </div>
      </div>
      {children}
    </div>
  );
};
