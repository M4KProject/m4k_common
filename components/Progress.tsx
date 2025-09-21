import { Css } from '@common/ui/html';
import { DivProps } from './Div';

import { clamp, round } from '@common/utils/nbr';
import { toNbr } from '@common/utils/cast';
import { flexCenter } from '@common/ui/flexBox';
import { ComponentChildren } from 'preact';

const c = Css('Progress', {
  '&': {
    ...flexCenter(),
    position: 'relative',
    bg: 'white',
    border: 'primary',
    borderRadius: '0.2em',
    w: '100%',
  },
  '&Bar': {
    position: 'absolute',
    xy: 0,
    h: '100%',
    w: 0,
    bg: 'primary',
    borderRadius: '0.2em 0 0 0.2em',
    transition: 'width 0.5s ease',
  },
  '&Text': {
    fg: 'black',
    zIndex: 1,
  },
});

export interface ProgressProps extends DivProps {
  step?: ComponentChildren;
  progress?: number | null;
}
export const Progress = ({ progress, step, children, ...props }: ProgressProps) => {
  const prct = clamp(round(toNbr(progress, 0)), 0, 100);
  return (
    <div {...props} class={c('', props)}>
      <div class={c('Bar')} style={{ width: prct + '%' }} />
      {step ? (
        <div class={c('Text')}>
          {step} ({prct}%)
        </div>
      ) : (
        <div class={c('Text')}>{prct}%</div>
      )}
      {children}
    </div>
  );
};
