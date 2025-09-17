import { setCss, Css } from '../ui/html';

export const useCss = (className: string, css?: Css) => {
  setCss(className, css);
  return className;
};
