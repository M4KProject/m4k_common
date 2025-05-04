import { HTMLAttributes } from "react";
import { clsx } from "../helpers/html";
import React from "react";

export interface DivProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
    cls?: any;
    style?: string | React.CSSProperties | undefined;
};

const getStyle = (style: string|React.CSSProperties|undefined): React.CSSProperties|undefined => {
    if (typeof style === 'string') {
        const styleObject = {} as any;
        style.split(";").forEach((declaration) => {
            const [property, value] = declaration.split(":");
            if (property && value) {
                const camelCaseProp = property.trim()
                    .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
                styleObject[camelCaseProp] = value.trim();
            }
        });
        return styleObject;
    }
    return style;
}

export const Div = ({ cls, style, className, ...props }: DivProps) => (
    <div {...props} style={getStyle(style)} className={clsx(cls, className)} />
);

export default Div