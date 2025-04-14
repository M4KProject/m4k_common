import { ReactNode } from "react";
import { Css } from "../helpers/html";
import useCss from "../hooks/useCss";
import Div, { DivProps } from "./Div";
import Tr from "./Tr";
import { addOverlay, removeOverlay } from "../helpers/overlay";
import { flexCenter } from "../helpers/flexBox";
import { createRoot } from "react-dom/client";
import React from "react";

// const css: Css = {
//     '&': {
//         display: 'inline-block',
//         position: 'relative',
//         top: '105%',
//         left: '',
//     },
//     // '&Mask': {
//     //     ...flexCenter(),
//     //     visibility: 'hidden',
//     //     position: 'absolute',
//     //     inset: 0,
//     //     transition: 'opacity 0.5s ease',
//     //     opacity: 0,
//     // },
//     '&Title': {
//         position: 'absolute',

//         fg: 'tooltipFg',
//         bg: 'tooltipBg',
//         m: 0,
//         p: 0.25,
//         px: 0.5,
//         rounded: 1,
//         zIndex: 1,
//         textAlign: 'center',
        
//         visibility: 'hidden',
//         opacity: 0,
//         transition: 'opacity 0.5s ease',
//     },
//     '&:hover &Title': { visibility: 'visible', opacity: 1 },
//     '&Title::after': {
//         content: '" "',
//         position: 'absolute',
//         m: -0.25,
//         w: 0.5,
//         h: 0.5,
//         fg: 'tooltipFg',
//         bg: 'tooltipBg',
//         transform: 'rotate(45deg)',
//         zIndex: -1,
//         top: '100%',
//         left: '50%',
//     },
    
//     '&-top &Title': { transform: 'translate(-50%, -100%)', top: '-0.5em', left: '50%' },
//     '&-top &Title::after': { top: '100%', left: '50%' },

//     '&-bottom &Title': { transform: 'translate(-50%, 100%)', bottom: '-0.5em', left: '50%' },
//     '&-bottom &Title::after': { top: '0%', left: '50%' },

//     '&-left &Title': { transform: 'translate(-100%, -50%)', top: '50%', left: '-0.5em' },
//     '&-left &Title::after': { top: '50%', left: '100%' },

//     '&-right &Title': { transform: 'translate(100%, -50%)', top: '50%', right: '-0.5em' },
//     '&-right &Title::after': { top: '50%', left: '0%' },
// }

// export interface TooltipProps extends Omit<DivProps, 'title'> {
//     title: ReactNode,
//     pos?: 'top'|'bottom'|'left'|'right',
// }
// const Tooltip = ({ cls, title, pos, children, ...props }: TooltipProps) => {
//     const c = useCss('Tooltip', css)
//     return (
//         <Div cls={[c, `${c}-${pos||'top'}`, cls]} {...props}>
//             <Div cls={`${c}Title`}>{title}</Div>
//             {children}
//         </Div>
//     );
// };


const css: Css = {
    '&': {
        position: 'absolute',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 9999,
    },
    '&Content': {
        ...flexCenter(),
        textAlign: 'center',
        position: 'absolute',
        p: 0.25,
        fg: 'tooltipFg',
        bg: 'tooltipBg',
        rounded: 1,
        fontFamily: 'Roboto',
    },
    '&Arrow': {
        position: 'absolute',
        m: -0.25,
        w: 0.5,
        h: 0.5,
        fg: 'tooltipFg',
        bg: 'tooltipBg',
        transform: 'rotate(45deg)',
    },

    '&-top &Content': { top: '-0.5em', left: '50%', transform: 'translate(-50%, -100%)' },
    '&-top &Arrow': { top: '-0.5em', left: '50%' },
}

export interface TooltipProps extends Omit<DivProps, 'title'> {
    target: HTMLElement,
    children: ReactNode,
}
const Tooltip = ({ cls, target, children, ...props }: TooltipProps) => {
    const c = useCss('Tooltip', css);
    const { top, left, width, height } = target.getBoundingClientRect();

    const pos: string = 'top';
    return (
        <Div cls={[`${c} ${c}-${pos}`, cls]} {...props} style={{
            top,
            left,
            width,
            height,
        }}>
            <Div cls={`${c}Arrow`} />
            <Div cls={`${c}Content`}>
                <Tr>{children}</Tr>
            </Div>
        </Div>
    );
};
// , pos?: 'top'|'bottom'|'left'|'right'

export const tooltip = (content: ReactNode|(() => ReactNode)) => {
    let overlay: HTMLDivElement|null = null;
    let root: ReturnType<typeof createRoot>|null = null;
    let intervalRef: any;
    const remove = () => {
        clearInterval(intervalRef);
        if (root) root.unmount();
        root = null;
        if (overlay) removeOverlay(overlay);
        overlay = null;
    }
    return {
        onMouseOver: (event: any) => {
            if (!overlay) overlay = addOverlay();
            if (!root) root = createRoot(overlay);
            const target = (event.currentTarget || event.target) as HTMLElement;
            intervalRef = setInterval(() => {
                if (!target.isConnected) remove();
            }, 500);
            root.render(
                <Tooltip target={target}>
                    {typeof content === 'function' ? content() : content}
                </Tooltip>
            );
        },
        onMouseLeave: remove,
    }
}