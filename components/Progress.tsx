import { Css } from '@common/ui/css';
import { DivProps } from './Div';

import { clamp, round } from '@common/utils/nbr';
import { toNbr } from '@common/utils/cast';

import { ComponentChildren } from 'preact';

const c = Css('Progress', {
  '': {
    fCenter: 1,
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
    fCenter: 1,
    position: 'absolute',
    xy: 0,
    wh: '100%',
    fg: 't1',
    zIndex: 1,
  },
  'Text-in': {
    fg: 'b1',
    transition: 0.5,
  },
});

export interface ProgressProps extends DivProps {
  step?: ComponentChildren;
  progress?: number | null;
}
export const Progress = ({ progress, step, children, ...props }: ProgressProps) => {
  const prct = clamp(toNbr(progress, 0), 0, 100);
  const text = step ? `${step} ${round(prct)}%` : `${round(prct)}%`;
  return (
    <div {...props} class={c('', props)}>
      <div class={c('Text')}>{text}</div>
      <div class={c('Bar')} style={{ left: (prct-100) + '%' }}>
        <div class={c('Text', 'Text-in')} style={{ left: -(prct-100) + '%' }}>
          {text}
        </div>
      </div>
      {children}
    </div>
  );
};
