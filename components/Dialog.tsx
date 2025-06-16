import { flexCenter, flexColumn } from "../helpers/flexBox";
import { useMsg } from "../hooks/useMsg";
import { Css } from "../helpers/html";
import { useCss } from "../hooks/useCss";
import { ReactNode } from "react";
import { Msg } from "../helpers/Msg";
import { Div, DivProps } from "./Div";
import { Tr } from "./Tr";
import { portal } from "./Portal";
import { useEffect } from "react";
import { useState } from "react";
import { toErr } from "@common/helpers/err";
import { addTranslates } from "@common/hooks/useTr";

addTranslates({
    Error: "Erreur",
    "Failed to update record.": "Échec de la modification."
});

export const showDialog = (title: string, content: (open$: Msg<boolean>) => ReactNode, props?: Partial<DialogRenderProps>) => {
    console.debug("showDialog", title);

    const open$ = new Msg(false);
    open$.on(v => !v && setTimeout(() => el.remove(), 500));

    const el = portal(
        <DialogRender open$={open$} title={title} {...props}>
            <Tr>{content(open$)}</Tr>
        </DialogRender>
    );
}

export const showError = (error: any) => {
    console.debug("showError", error);
    const err = toErr(error);
    showDialog(err.name, () => err.message, { variant: 'error' })
}

const css: Css = {
    '&': {
        position: 'fixed',
        inset: 0,
        bg: '#000000AA',
        ...flexCenter(),
        opacity: 0,
        transition: 'all 0.5s ease',
    },
    '&Window': {
        ...flexColumn(),
        elevation: 3,
        rounded: 2,
        maxWidth: '80%',
        minWidth: '80%',
        overflow: 'hidden',
        bg: 'bg',
        transform: 'scale(0)',
        transition: 'all 0.5s ease',
    },
    '&Header': {
        ...flexCenter(),
        textAlign: 'center',
        fontSize: 1.4,
        fontWeight: "bold",
        m: 0,
        p: 1,
        bg: 'header',
        fg: 'headerTitle',
    },
    '&Content': {
        ...flexColumn(),
        m: 1,
    },

    '&-open': {
        opacity: 1,
    },
    '&-open &Window': {
        transform: 'scale(1)',
    },
    '&-error &Header': {
        fg: 'error',
    },
}

interface DialogRenderProps extends DivProps {
    open$: Msg<boolean>;
    variant?: 'error',
}
const DialogRender = ({ open$, variant, title, children, ...props }: DialogRenderProps) => {
    const c = useCss('Dialog', css);
    const open = useMsg(open$);
    const onClose = () => open$.set(false);
    const [init, setInit] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            open$.set(true)
        }, 10);
    }, []);

    useEffect(() => {
        if (open) setInit(true);
    }, [open])
    
    return (
        <Div cls={[c, open && `${c}-open`, variant && `${c}-${variant}`]} onClick={onClose} {...props}>
            <Div cls={`${c}Window`} onClick={e => e.stopPropagation()}>
                {title && (
                    <Div cls={`${c}Header`}>
                        <Tr>{title}</Tr>
                    </Div>
                )}
                <Div cls={`${c}Content`}>
                    {init ? children : null}
                </Div>
            </Div>
        </Div>
    );
};
