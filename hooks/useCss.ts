import { setCss, Css } from '@common/ui/html';

export const useCss = (className: string, css?: Css) => {
  setCss(className, css);
  return className;
};
