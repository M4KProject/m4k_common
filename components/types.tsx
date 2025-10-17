import { CSSProperties, JSX } from 'preact';

export type Style = CSSProperties;
export type GetProps<T> = Omit<T, 'style'> & { style?: Style };

export type Props = {
  [K in keyof JSX.IntrinsicElements]: GetProps<JSX.IntrinsicElements[K]>;
};

export type DivProps = Props['div'];
export type LinkProps = Props['a'];
export type ButtonProps = Props['button'];
export type FormProps = Props['form'];
export type SpanProps = Props['span'];
export type IframeProps = Props['iframe'];
