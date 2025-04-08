import React from "react";
import cls from "../helpers/cls";
import { flexCenter } from "../helpers/flexBox";
import { Css } from "../helpers/html";
import useCss from "../hooks/useCss";
import { tCls, ThemeColor } from "../messages/theme$";

const css: Css = {
    '&': {
        ...flexCenter(),
        px: 1,
        py: 0.5,
        rounded: 1,
        border: 0,
        fontSize: 1,
    },
    '&:hover': {}
}

export type HTMLButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export interface ButtonProps extends HTMLButtonProps {
    color?: ThemeColor;
};

// '& primary': { bg: 'primary' },
// '& secondary': { bg: 'secondary' },
// '& success': { bg: 'success' },
// '& warn': { bg: 'warn' },
// '& error': { bg: 'error' },

const Button = ({ className, color, ...props }: ButtonProps) => {
    const buttonClass = useCss('Button', css)
    const themeClass = tCls(color||'default')
    return (
        <button
            className={cls(
                themeClass,
                buttonClass,
                className,
            )}
            {...props}
        />
    );
};

export default Button