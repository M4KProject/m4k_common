import { setCss, Css } from "../helpers/html";

export const useCss = (className: string, css?: Css) => {
    setCss(className, css);
    return className;
}
