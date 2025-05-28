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

// export interface DialogOptions {
//     id?: string;
//     title: string;
//     content: () => ReactNode;
//     closed: number;
//     onClose?: () => void;
// }

export const showDialog = (title: string, content: (open$: Msg<boolean>) => ReactNode) => {
    console.debug("showDialog", title);

    // const dialog$ = new Msg<DialogOptions>({
    //     id,
    //     title,
    //     content,
    //     closed: 0,
    //     onClose: () => {
    //         dialog$.merge()
    //     }
    // });

    const open$ = new Msg(false);
    open$.on(v => !v && setTimeout(() => el.remove(), 500));

    const el = portal(
        <DialogRender open$={open$} title={title}>
            {content(open$)}
        </DialogRender>
    );
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
}

interface DialogRenderProps extends DivProps {
    open$: Msg<boolean>;
}
const DialogRender = ({ open$, title, children, ...props }: DialogRenderProps) => {
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
        <Div cls={[c, open && `${c}-open`]} onClick={onClose} {...props}>
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
