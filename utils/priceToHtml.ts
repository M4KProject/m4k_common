import { toNbr } from './cast';

export default function priceToHtml(v: any, i: number) {
  v = toNbr(v, 0);
  const n = Math.floor(v);
  const d = Math.round((v % 1) * 100);
  const cls = ['price', 'price-i' + i];
  if (v === 0) cls.push('price-0');
  if (n === 0) cls.push('price-n0');
  if (d === 0) cls.push('price-d0');
  return `<div class="${cls.join(' ')}"><b>${n}</b><i>,${d < 10 ? '0' + d : d}</i><u>€</u></div>`;
}
