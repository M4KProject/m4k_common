import { ComponentChildren, JSX } from "preact";
import { useRef } from "preact/hooks";
import { flexCenter, flexRow } from "../helpers/flexBox";
import { Css, clsx } from "../helpers/html";
import { useCss } from "../hooks/useCss";
import { Div, DivProps } from "./Div";
import { Tr } from "./Tr";

const css: Css = {
    '&': {
        ...flexRow({ align: 'center', justify: 'start' }),
        position: "relative",
        m: 0.2,
        p: 0.2,
        rounded: 2,
        border: 'none',
        bg: 'transparent',
        fg: 'fg',
        hMin: 2.5,
    },
    '&Row': {
        ...flexRow({ align: 'center', justify: 'around' }),
    },
    '&-icon': {
        m: 0,
    },
    '&Icon': {
        ...flexCenter(),
        mx: 0.25,
        w: 1.4,
        h: 1.4,
        rounded: 2,
        bg: 'white',
        fg: 'selectedFg',
    },
    '&Content': {
        m: 0.25,
        flex: 1,
        textAlign: 'left',
    },
    '&Sfx': {
        position: 'absolute',
        inset: 0,
        bg: 'white',
        zIndex: -1,
        transition: 'transform 0.5s ease',
        scaleX: 0,
        transformOrigin: 'left',
        rounded: 2,
        elevation: 1,
    },

    '&:hover, &-selected': { fg: 'selectedFg' },
    '&:hover &Sfx, &-selected &Sfx': { scaleX: 1 },
    // '&:hover &Content, &-selected &Content': { fontWeight: 'bold' },
    '&:active &Sfx': { elevation: 0 },

    '&-primary': { bg: 'primary', fg: 'white' },
    '&-secondary': { bg: 'secondary', fg: 'white' },
    '&-success': { bg: 'success', fg: 'white' },
    '&-warn': { bg: 'warn', fg: 'white' },
    '&-error': { bg: 'error', fg: 'white' },
    
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

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
    cls?: any
    color?: 'primary'|'secondary'|'success'|'warn'|'error',
    variant?: 'upload',
    selected?: boolean,
    icon?: ComponentChildren,
    before?: ComponentChildren,
    title?: string,
};

export const Button = ({ title, cls, color, variant, selected, icon, children, before, onClick, ...props }: ButtonProps) => {
    const c = useCss('Button', css);

    const isIcon = icon && !(children || title);

    return (
        <button
            class={clsx(
                c,
                color && `${c}-${color}`,
                selected && `${c}-selected`,
                isIcon && `${c}-icon`,
                variant && `${c}-${variant}`,
                cls
            )}
            onClick={onClick}
            {...props}
        >
            <Div cls={`${c}Sfx`} />
            {before}
            {icon && <Div cls={`${c}Icon`}>{icon}</Div>}
            {(title || children) && (
                <Div cls={`${c}Content`}>
                    {title && <Tr>{title}</Tr>}
                    {children && <Tr>{children}</Tr>}
                </Div>
            )}
        </button>
    );
};

export interface UploadButtonProps extends ButtonProps {
    onFiles?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    icon?: ComponentChildren;
}

export const UploadButton = ({ onClick, onFiles, accept, multiple, ...props }: UploadButtonProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (
        <Button
            variant="upload"
            onClick={event => {
                if (onClick) onClick(event);
                inputRef.current?.click();
            }}
            {...props}
            before={
                <input
                    style={{ display: "none" }}
                    type="file"
                    ref={inputRef}
                    accept={accept}
                    multiple={multiple||true}
                    onChange={event => {
                        const target = event.target as HTMLInputElement;
                        const files = Array.from(target.files||[]);
                        if (onFiles) onFiles(files);
                        if (inputRef.current) inputRef.current.value = "";
                    }}
                />
            }
        />
    )
}

export interface ButtonRowProps extends DivProps {};
export const ButtonRow = (props: ButtonRowProps) => {
    const c = useCss('Button', css);
    return <Div {...props} cls={[`${c}Row`, props.cls]} />;
}
