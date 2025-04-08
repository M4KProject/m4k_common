import { ReactNode } from "react";
import Msg from "../helpers/Msg";

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