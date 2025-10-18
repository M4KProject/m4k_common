import { CSSProperties, JSX } from 'preact';

export type Style = CSSProperties;
export type GetProps<T> = Omit<T, 'style'> & { style?: Style };

export type Props = {
  [K in keyof JSX.IntrinsicElements]: GetProps<JSX.IntrinsicElements[K]>;
};

export type DivProps = Props['div'];
