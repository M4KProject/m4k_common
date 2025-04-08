import { setCls } from './html';
import router from './router';

export default function calcBodyClass() {
  // console.debug('calcBodyClass');
  const body = document.body;
  const w = body.clientWidth;
  setCls(body, { 's-xs': w < 576, 's-sm': w >= 576, 's-md': w >= 768, 's-lg': w >= 992, 's-xl': w >= 1200 }, true);
  const cls = router.current.params.cls;
  if (cls) body.classList.add(...cls.split(' '));
}
