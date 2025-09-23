import { JSX } from 'preact';
import { useTr } from '../hooks/useTr';
import { isStr } from '@common/utils/check';

export interface TrProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: any;
}

export const Tr = ({ children }: TrProps) => {
  const tr = useTr();
  return isStr(children) ? tr(children) : children;
};
