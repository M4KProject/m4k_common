import { setCss, Css } from "../helpers/html";

const useCss = (className: string, css?: Css) => {
    setCss(className, css);
    return className;
}

export default useCss;
