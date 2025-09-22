import { ComponentChildren } from 'preact';
import { render } from 'preact';
import { Css, addListener } from '@common/ui/html';
import { Tr } from './Tr';
import { addOverlay, removeOverlay } from '@common/ui/overlay';

import { DivProps } from './Div';

// const c = Css('', {
//     '': {
//         display: 'inline-block',
//         position: 'relative',
//         top: '105%',
//         left: '',
//     },
//     // 'Mask': {
//     //     fCenter: 1,
//     //     visibility: 'hidden',
//     //     position: 'absolute',
//     //     inset: 0,
//     //     transition: 'opacity 0.5s ease',
//     //     opacity: 0,
//     // },
//     'Title': {
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
//     ':hover &Title': { visibility: 'visible', opacity: 1 },
//     'Title::after': {
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

//     '-top &Title': { transform: 'translate(-50%, -100%)', top: '-0.5em', left: '50%' },
//     '-top &Title::after': { top: '100%', left: '50%' },

//     '-bottom &Title': { transform: 'translate(-50%, 100%)', bottom: '-0.5em', left: '50%' },
//     '-bottom &Title::after': { top: '0%', left: '50%' },

//     '-left &Title': { transform: 'translate(-100%, -50%)', top: '50%', left: '-0.5em' },
//     '-left &Title::after': { top: '50%', left: '100%' },

//     '-right &Title': { transform: 'translate(100%, -50%)', top: '50%', right: '-0.5em' },
//     '-right &Title::after': { top: '50%', left: '0%' },
// }

// export interface TooltipProps extends Omit<divProps, 'title'> {
//     title: ReactNode,
//     pos?: 'top'|'bottom'|'left'|'right',
// }
// const Tooltip = ({ title, pos, children, ...props }: TooltipProps) => {
//     const c = useCss('Tooltip', css)
//     return (
//         <div class={[c, `${c}-${pos||'top'}`, cls]} {...props}>
//             <div class={c('Title')}>{title}</div>
//             {children}
//         </div>
//     );
// };

const c = Css('Tooltip', {
  '': {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    zIndex: 9999,
  },
  Content: {
    fCenter: 1,
    textAlign: 'center',
    position: 'absolute',
    p: 0.25,
    fg: 'tooltipFg',
    bg: 'tooltipBg',
    rounded: 1,
    fontFamily: 'Roboto',
  },
  Arrow: {
    position: 'absolute',
    m: -0.25,
    w: 0.5,
    h: 0.5,
    fg: 'tooltipFg',
    bg: 'tooltipBg',
    rotate: '45deg',
  },

  '-top &Content': { top: '-0.5em', x: '50%', translate: '-50%, -100%' },
  '-top &Arrow': { top: '-0.5em', x: '50%' },

  '-bottom &Content': { bottom: '-0.5em', x: '50%', translate: '-50%, 100%' },
  '-bottom &Arrow': { bottom: '-0.5em', x: '50%' },
});

export interface TooltipProps extends Omit<DivProps, 'title'> {
  target: HTMLElement;
  children: ComponentChildren;
}
export const Tooltip = ({ target, children, ...props }: TooltipProps) => {
  const { top, left, width, height } = target.getBoundingClientRect();

  console.debug('top', top);

  const pos: string = top > 40 ? 'top' : 'bottom';
  return (
    <div {...props} class={c('', `-${pos}`, props)} style={{ top, left, width, height }}>
      <div class={c('Arrow')} />
      <div class={c('Content')}>
        <Tr>{children}</Tr>
      </div>
    </div>
  );
};
// , pos?: 'top'|'bottom'|'left'|'right'

export const tooltip = (content: ComponentChildren | (() => ComponentChildren)) => {
  let intervalRef: any;
  let overlay: HTMLDivElement | null = null;
  let root: any = null;
  let removeLeaveListener: (() => void) | null = null;
  let removeClickListener: (() => void) | null = null;
  const remove = async () => {
    clearInterval(intervalRef);
    if (removeLeaveListener) {
      removeLeaveListener();
      removeLeaveListener = null;
    }
    if (removeClickListener) {
      removeClickListener();
      removeClickListener = null;
    }
    if (overlay) {
      await removeOverlay(overlay);
      overlay = null;
    }
    if (root) {
      root.unmount();
      root = null;
    }
  };
  return {
    onMouseOver: (event: any) => {
      const target = (event.currentTarget || event.target) as HTMLElement;

      clearInterval(intervalRef);
      intervalRef = setInterval(() => {
        if (!target.isConnected) remove();
      }, 500);

      if (removeLeaveListener) removeLeaveListener();
      removeLeaveListener = addListener(target, 'mouseleave', remove);

      if (removeClickListener) removeClickListener();
      removeClickListener = addListener(0, 'click', remove);

      if (!overlay) overlay = addOverlay();

      render(
        <Tooltip target={target}>{typeof content === 'function' ? content() : content}</Tooltip>,
        overlay
      );
    },
  };
};
