import { JSX } from 'preact';
import { clsx, Css } from '@common/ui/html';


const css = Css('Iframe', {
  '&': {
    // position: "relative",
    // w: "100%",
    // h: "100%",
    // border: 'none',
    border: '1px solid red',
  },
});

export interface IframeProps extends JSX.HTMLAttributes<HTMLIFrameElement> {
  cls?: any;
}

export const Iframe = ({ cls, className, ...props }: IframeProps) => {
  return <iframe {...props} class={clsx(css(), cls, className)} />;
};
