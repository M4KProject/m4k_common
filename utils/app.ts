import { TMap } from './types';

export const appGlobal = (
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : {}
) as typeof window & TMap<any>;

export const app: TMap<any> = appGlobal._app || (appGlobal._app = {});
app.global = appGlobal;

export const appAssign = (...sources: TMap<any>[]) => Object.assign(appGlobal, ...sources);
