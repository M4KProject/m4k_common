import { flexCenter, flexColumn } from "../helpers/flexBox";
import useMsg from "../hooks/useMsg";
import { Css } from "../helpers/html";
import useCss from "../hooks/useCss";
import { ReactNode } from "react";
import Msg from "../helpers/Msg";
import Div from "./Div";
import Tr from "./Tr";

export interface DialogOptions {
    id?: string;
    title: string;
    content: () => ReactNode;
    onClose?: () => void;
}

export const dialog$ = new Msg<DialogOptions|null>(null)

export const showDialog = (title: string, content: () => ReactNode, options?: Partial<DialogOptions>) => {
    console.debug("showDialog", title)
    const onClose = () => dialog$.set(null)
    dialog$.set({ title, content, onClose, ...options })
}

const css: Css = {
    '&': {
        position: 'fixed',
        inset: 0,
        bg: '#000000AA',
        ...flexCenter(),
    },
    '&Window': {
        ...flexColumn(),
        elevation: 3,
        rounded: 2,
        maxWidth: '80%',
        minWidth: '80%',
        overflow: 'hidden',
        bg: 'bg',
    },
    '&Header': {
        ...flexCenter(),
        textAlign: 'center',
        fontSize: 1.4,
        fontWeight: "bold",
        m: 0,
        p: 1,
        py: 0.2,
        bg: 'header',
        fg: 'headerTitle',
    },
    '&Content': {
        ...flexColumn(),
        m: 1,
    },
}

const Dialog = () => {
    const c = useCss('Dialog', css)
    const dialog = useMsg(dialog$)
    console.debug("Dialog", dialog);

    if (!dialog) return null;

    const { onClose, title, content } = dialog
    const Content = content
    
    return (
        <Div cls={c} onClick={onClose}>
            <Div cls={`${c}Window`} onClick={e => e.stopPropagation()}>
                {title && (
                    <Div cls={`${c}Header`}>
                        <Tr>{title}</Tr>
                    </Div>
                )}
                <Div cls={`${c}Content`}>
                    <Content />
                </Div>
            </Div>
        </Div>
    );
};

export default Dialog