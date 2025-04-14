import { setCss } from './html'
import Msg from './Msg'

export type Responsive = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const responsive$ = new Msg<Responsive>('md') 

const applyResponsive = () => {
    console.debug('applyResponsive');
    const body = document.documentElement || document.body;
    const w = body.clientWidth;
    const h = body.clientHeight;
    const hypotenuse = Math.sqrt(w * w + h * h);
    const fontSize = (hypotenuse / 90) + 'px';
    responsive$.set(w < 576 ? 'xs' : w < 768 ? 'sm' : w < 992 ? 'md' : w < 1200 ? 'lg' : 'xl');
    setCss('fontSize', { body: { fontSize } });
}

let isAdded = false
export const addResponsiveListener = () => {
    if (isAdded) return;
    isAdded = true;
    applyResponsive();
    setTimeout(applyResponsive, 1000);
    window.addEventListener('resize', applyResponsive, true);
}