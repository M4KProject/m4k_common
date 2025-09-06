import { toNbr } from './cast';
import { isNbr } from './check';

export const round = (number: number, digits = 0, base = Math.pow(10, digits)): number =>
  Math.round(base * number) / base + 0;

export const floor = (number: number, digits = 0, base = Math.pow(10, digits)): number =>
  Math.floor(base * number) / base + 0;

export const nbrDiff = (a: number, b: number): number => Math.abs(a - b);
export const nbrMax = (a: number, b?: number): number => (b > a ? b : a);
export const nbrMin = (a: number, b?: number): number => (b < a ? b : a);
export const clamp = (v: number, min?: number, max?: number): number =>
  isNbr(min) && v < min ? min : isNbr(max) && v > max ? max : v;

export const nbr = toNbr;
