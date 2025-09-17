import { setCss } from './html';
import { Msg } from '@common/utils/Msg';

export type Responsive = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const responsive$ = new Msg<Responsive>('md');

const applyResponsive = () => {
  // console.debug('applyResponsive');
  const body = document.documentElement || document.body;
  const w = body.clientWidth;
  const h = body.clientHeight;
  const hypotenuse = Math.sqrt(w * w + h * h);
  const fontSize = hypotenuse / 100 + 'px';
  responsive$.set(w < 576 ? 'xs' : w < 768 ? 'sm' : w < 992 ? 'md' : w < 1200 ? 'lg' : 'xl');
  setCss('fontSize', { 'html,body': { fontSize } });
};

let isAdded = false;
export const addResponsiveListener = () => {
  if (isAdded) return;
  isAdded = true;
  // console.debug('addResponsiveListener');
  [50, 100, 200, 500, 1000, 2000].forEach((ms) => setTimeout(applyResponsive, ms));
  // deno-lint-ignore no-window no-window-prefix
  window.addEventListener('resize', applyResponsive, true);
};
