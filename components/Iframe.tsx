import { JSX } from 'preact';
import { clsx, Css } from '@common/ui/html';
import { useCss } from '../hooks/useCss';

const css: Css = {
  '&': {
    // position: "relative",
    // w: "100%",
    // h: "100%",
    // border: 'none',
    border: '1px solid red',
  },
};

export interface IframeProps extends JSX.HTMLAttributes<HTMLIFrameElement> {
  cls?: any;
}

export const Iframe = ({ cls, className, ...props }: IframeProps) => {
  const c = useCss('Iframe', css);
  return <iframe {...props} class={clsx(c, cls, className)} />;
};
