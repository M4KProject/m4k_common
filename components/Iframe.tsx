import { HTMLAttributes } from "react";
import { clsx, Css } from "../helpers/html";
import { useCss } from "../hooks/useCss";

const css: Css = {
    '&': {
        // position: "relative",
        // w: "100%",
        // h: "100%",
        // border: 'none',
        border: '1px solid red',
    },
}

export interface IframeProps extends HTMLAttributes<HTMLIFrameElement> {
    cls?: any;
};

export const Iframe = ({ cls, className, ...props }: IframeProps) => {
    const c = useCss('Iframe', css);
    return (
        <iframe {...props} className={clsx(c, cls, className)} />
    )
};
