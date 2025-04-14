import { HTMLAttributes, ReactNode, useRef } from "react";
import { flexCenter, flexRow } from "../helpers/flexBox";
import { Css, clsx } from "../helpers/html";
import useCss from "../hooks/useCss";
import Div, { DivProps } from "./Div";
import Tr from "./Tr";
import React from "react";

const css: Css = {
    '&': {
        ...flexRow({ align: 'center', justify: 'start' }),
        position: "relative",
        m: 0.5,
        p: 0.5,
        rounded: 2,
        border: 'none',
        fontSize: 1,
        bg: 'transparent',
        fg: 'fg',
        hMin: 2.5,
    },
    '&Icon': {
        ...flexCenter(),
        mx: 0.25,
        w: 1.4,
        h: 1.4,
        rounded: 2,
        fontSize: 1.2,
        bg: 'white',
        fg: 'selectedFg',
    },
    '&Content': {
        m: 0.25,
        flex: 1,
        fontSize: 1.1,
        textAlign: 'left',
    },
    '&Sfx': {
        position: 'absolute',
        inset: 0,
        bg: 'white',
        zIndex: -1,
        transition: 'transform 0.5s ease',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        rounded: 2,
        elevation: 1,
    },

    '&:hover, &-selected': { fg: 'selectedFg' },
    '&:hover &Sfx, &-selected &Sfx': { transform: 'scaleX(1)' },
    // '&:hover &Content, &-selected &Content': { fontWeight: 'bold' },
    '&:active &Sfx': { elevation: 0 },
    
    '&-primary &Icon': { bg: 'white', fg: 'primary' },
    '&-secondary &Icon': { bg: 'white', fg: 'secondary' },
    '&-success &Icon': { bg: 'white', fg: 'success' },
    '&-warn &Icon': { bg: 'white', fg: 'warn' },
    '&-error &Icon': { bg: 'white', fg: 'error' },

    '&:hover &Icon': { bg: 'selectedFg', fg: 'white' },
    '&-primary:hover &Icon': { bg: 'primary', fg: 'white' },
    '&-secondary:hover &Icon': { bg: 'secondary', fg: 'white' },
    '&-success:hover &Icon': { bg: 'success', fg: 'white' },
    '&-warn:hover &Icon': { bg: 'warn', fg: 'white' },
    '&-error:hover &Icon': { bg: 'error', fg: 'white' },
}

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    cls?: any
    color?: 'primary'|'secondary'|'success'|'warn'|'error',
    variant?: 'icon',
    selected?: boolean,
    icon?: ReactNode,
};

const Button = ({ cls, color, variant, selected, icon, children, ...props }: ButtonProps) => {
    const c = useCss('Button', css)

    return (
        <button
            className={clsx(
                c,
                color && `${c}-${color}`,
                selected && `${c}-selected`,
                variant && `${c}-${variant}`,
                cls
            )}
            {...props}
        >
            <Div cls={`${c}Sfx`} />
            {icon && (
                <Div cls={`${c}Icon`}>{icon}</Div>
            )}
            {children && (
                <Div cls={`${c}Content`}>
                    <Tr>{children}</Tr>
                </Div>
            )}
        </button>
    );
};

export const IconButton = (props: ButtonProps) => <Button {...props} variant="icon" />
export const PrimaryButton = (props: ButtonProps) => <Button {...props} color="primary" />
export const SecondaryButton = (props: ButtonProps) => <Button {...props} color="secondary" />

export interface UploadButtonProps extends ButtonProps {
    onFiles?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    icon?: ReactNode;
}
export const UploadButton = ({ cls, children, onClick, onFiles, accept, multiple, ...props }: UploadButtonProps) => {
    const c = useCss('Button', css);
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (
        <Button
            cls={[`${c}-upload`, cls]}
            onClick={event => {
                if (onClick) onClick(event);
                inputRef.current?.click();
            }}
            {...props}
        >
            <input
                style={{ display: "none" }}
                type="file"
                ref={inputRef}
                accept={accept}
                multiple={multiple||true}
                onChange={event => {
                    const files = Array.from(event.target.files||[]);
                    if (onFiles) onFiles(files);
                    if (inputRef.current) inputRef.current.value = "";
                }}
            />
            <Tr>{children}</Tr>
        </Button>
    )
}

export default Button