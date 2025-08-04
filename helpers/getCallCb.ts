// import { stringify } from './json';
// import { toNbr } from './cast';
import type B from './B';
import type { BElement } from './B';

export type CallCb = (b: B, el: BElement, app: any) => any;
// const _nullCb = () => {};
// const _scriptCache: Record<string, CallCb> = { '': _nullCb };

export default function getCallCb(script: string = '', noReturn?: boolean): CallCb {
  console.warn('not implemented getCallCb', script, noReturn)
  return {} as any
  // let cb = _scriptCache[script];
  // if (!cb) {
  //   try {
  //     let s = script;
  //     const name = s.split(':', 1)[0];
  //     const fun = app[name];
  //     console.debug('script 1', { s, name, fun });
  //     if (fun) {
  //       const pStr = s.substring(name.length + 1);
  //       const p = toNbr(pStr, pStr);
  //       const pJson = p ? stringify(p) : 'b,el,app';
  //       s = `app.${name}(${pJson})`;
  //       console.debug('script 2', { p, pStr, pJson, s });
  //     }
  //     if (!noReturn) {
  //       s = 'return ' + s;
  //     }
  //     const js = `(function(b,el,app){\n${s};\n})`;
  //     console.debug('script 3', { js });
  //     cb = _eval(js);
  //   } catch (error) {
  //     console.error('script', script, error);
  //     cb = _nullCb;
  //   }
  //   _scriptCache[script] = cb;
  // }
  // return cb;
}
