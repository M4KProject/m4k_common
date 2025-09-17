import { Css } from '@common/ui/html';
import { Div, DivProps } from './Div';
import { useCss } from '../hooks/useCss';
import { clamp, round } from '@common/utils/nbr';
import { toNbr } from '@common/utils/cast';
import { flexCenter } from '@common/ui/flexBox';
import { ComponentChildren } from 'preact';

const css: Css = {
  '&': {
    ...flexCenter(),
    position: 'relative',
    bg: 'white',
    border: 'primary',
    borderRadius: '0.2em',
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
};

export interface ProgressProps extends DivProps {
  step?: ComponentChildren;
  progress?: number | null;
}
export const Progress = ({ progress, step, cls, children, ...props }: ProgressProps) => {
  const c = useCss('Progress', css);
  const prct = clamp(round(toNbr(progress, 0)), 0, 100);
  return (
    <Div {...props} cls={[c, cls]}>
      <Div cls={`${c}Bar`} style={{ width: prct + '%' }} />
      {step ? (
        <Div cls={`${c}Text`}>
          {step} ({prct}%)
        </Div>
      ) : (
        <Div cls={`${c}Text`}>{prct}%</Div>
      )}
      {children}
    </Div>
  );
};
