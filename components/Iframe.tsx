import { JSX } from 'preact';
import { clsx, Css } from '@common/ui/css';

const c = Css('Iframe', {
  '': {
    border: '1px solid red',
  },
});

export interface IframeProps extends JSX.HTMLAttributes<HTMLIFrameElement> {
  class?: string;
}

export const Iframe = ({ className, ...props }: IframeProps) => {
  return <iframe {...props} class={c('', props)} />;
};
