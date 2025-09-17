import { addEl, Css, setCss, setEl } from './html';
import { sleep } from '@common/utils/async';

const overlayCss: Css = {
  '&': {
    position: 'fixed',
    xy: 0,
    transition: 'opacity 0.2s ease',
    opacity: 1,
  },
  '&-adding': { opacity: 0 },
  '&-removed': { opacity: 0 },
};

export const addOverlay = () => {
  const c = setCss('Overlay', overlayCss);
  const el = addEl('div', { className: `${c} ${c}-adding`, parent: 'body' });
  setTimeout(() => setEl(el, { className: c }), 10);
  return el as HTMLDivElement;
};

export const removeOverlay = async (el: HTMLDivElement) => {
  const c = setCss('Overlay', overlayCss);
  setEl(el, { className: `${c} ${c}-removed` });
  await sleep(300);
  el.remove();
  return;
};
