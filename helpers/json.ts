import { catcher } from './err.ts';

export const stringify = catcher(JSON.stringify, '');

export const parse = catcher(JSON.parse);

export const clone = <T>(value: T) => parse(stringify(value)) as T;