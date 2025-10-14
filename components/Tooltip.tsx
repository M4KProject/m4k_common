import { ComponentChildren } from 'preact';
import { render } from 'preact';
import { addListener } from '@common/ui/html';
import { Css } from '@common/ui/css';
import { Tr } from './Tr';
import { addOverlay, removeOverlay } from '@common/ui/overlay';
import { DivProps } from './types';

const c = Css('Tooltip', {
  '': {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    zIndex: 9999,
  },
  Content: {
    fCenter: [],
    textAlign: 'center',
    position: 'absolute',
    p: 0.5,
    fg: 'w0',
    bg: 'p9',
    rounded: 1,
    fontFamily: 'Roboto',
  },
  Arrow: {
    position: 'absolute',
    m: -0.25,
    w: 0.5,
    h: 0.5,
    fg: 'w0',
    bg: 'p9',
    rotate: '45deg',
  },

  '-top &Content': { t: -0.5, x: '50%', translate: '-50%, -100%' },
  '-top &Arrow': { t: -0.5, x: '50%' },

  '-bottom &Content': { b: -0.5, x: '50%', translate: '-50%, 100%' },
  '-bottom &Arrow': { b: -0.5, x: '50%' },
});

export interface TooltipProps extends Omit<DivProps, 'title'> {
  target: HTMLElement;
  children: ComponentChildren;
}
export const Tooltip = ({ target, children, ...props }: TooltipProps) => {
  const { top, left, width, height } = target.getBoundingClientRect();

  console.debug('top', top);

  if (!children) return null;

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
