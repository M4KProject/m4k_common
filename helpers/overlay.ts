import { addEl, Css, setCss, setEl } from "../helpers/html";

const overlayCss: Css = {
    '&': {
        position: 'fixed',
        top: '0',
        left: '0',
        transition: 'opacity 0.2s ease',
        opacity: 1,
    },
    '&-adding': { opacity: 0 },
    '&-removed': { opacity: 0 }
}

export const addOverlay = () => {
    const c = setCss('Overlay', overlayCss);
    const el = addEl('div', { className: `${c} ${c}-adding`, parent: 'body' });
    setTimeout(() => setEl(el, { className: c }), 10);
    return el as HTMLDivElement;
}

export const removeOverlay = (el: HTMLDivElement) => {
    const c = setCss('Overlay', overlayCss);
    setEl(el, { className: `${c} ${c}-removed` });
    setTimeout(() => el.remove(), 500);
}