import { JSX } from 'preact/jsx-runtime';

export type Style = JSX.CSSProperties;
export type Props<T> = Omit<T, 'style'> & { style?: Style };

export type DivProps = Props<JSX.HTMLAttributes<HTMLDivElement>>;
