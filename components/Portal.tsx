import { createRoot } from "react-dom/client";
import { El, ElOptions } from "../helpers/html";
import { ReactNode } from "react";

export const portal = (content: ReactNode, o?: ElOptions) => {
    const el = El('div', { parent: 'body', ...o });
    createRoot(el).render(content);
    return el;
}