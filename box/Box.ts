// import { deepClone, Dictionary, flux, toArray, toItem } from 'fluxio';
// import { BoxData, D, DCall, DRoot, DStyle } from './types';
// import { addCssFile, addJsFile, setAttrs } from '../ui/html';
// import { addFont } from '@common/ui/addFont';

// const body = document.body;
// const bodyClass = body.classList;
// const lSource = 'fr';

// ///// Data Interfaces /////

// export type BElement = HTMLElement & { _b?: B; _d?: D };
// export type RenderProp = (el: BElement, value: any, b: B) => void;

// ///// Element Render /////

// const props: Partial<Record<keyof D, RenderProp>> = {
//   id: (el, v) => (el.id = v),
//   t: (el, v) => el.classList.add(v),
//   style: styleProp(),
//   cls: (el, v) =>
//     String(v)
//       .split(' ')
//       .forEach((p) => el.classList.add(p)),
//   hide: (el, v) => (v ? el.classList.add('hide') : el.classList.remove('hide')),
//   stock: (el, v) => (v === 0 ? el.classList.add('out') : el.classList.remove('out')),
//   attrs: (el, v) => setAttrs(el, v),
//   jsFs: (_, v) => toArray(v).map((f) => addJsFile(B.url(f))),
//   cssFs: (_, v) => toArray(v).map((f) => addCssFile(B.url(f))),
//   fonts: (_, v) => toArray(v).map((f) => addFont(f)),
//   bgImg: (el, v) => (el.style.backgroundImage = `url(${B.url(v)})`),
//   src: (el, v) => ((el as HTMLImageElement).src = B.url(v)),
//   alt: (el, v) => el.setAttribute('alt', v),
//   ctn: (el, v) => (el.innerHTML = v),
//   render: (el, v) => el._b!.callRender(el, v),
//   page: (el, page) => {
//     const cls: Cls = { page: true };
//     String(page)
//       .split('+')
//       .forEach((p) => {
//         if (B.page$.v.split('+').includes(p)) cls.curr = true;
//         cls['page-' + p] = true;
//       });
//     setCls(el, true);
//   },
//   click: (el, v) => (el._b!.click = v),
// };

// ///// Box /////

// // const prdTemplate = (t: string): D => ({
// //   render: 'prd',
// //   children: [
// //     { prop: 'img', cls: `${t}_img`, propLink: 'bgImg' },
// //     {
// //       cls: `prd_header ${t}_header`,
// //       children: [
// //         { render: 'count' },
// //         { prop: 'title' },
// //         { prop: 'info' },
// //         { prop: 'icons', propLink: 'icons', render: 'icons' },
// //         { cls: 'flex' },
// //         { prop: 'cl', propLink: 'cl', render: 'cl' },
// //         { prop: 'prices', propLink: 'prices', render: 'prices' },
// //         ...(t === 'cat' ? [{ prop: 'tPrices', propLink: 'tPrices', render: 'tPrices' } as D] : []),
// //       ],
// //     },
// //     { prop: 'desc', cls: `${t}_desc` },
// //   ],
// // });

// // const defaultTemplates: Record<string, D> = {
// //   video: {
// //     hTag: 'video',
// //     attrs: { autoplay: '', loop: '', playsinline: '', muted: '' },
// //     render: 'video',
// //     click: 'playPause',
// //   },
// //   lang: { render: 'lang' },
// //   icons: { render: 'icons' },
// //   prices: { render: 'prices' },
// //   carousel: { render: 'carousel' },
// //   pdf: { render: 'carousel' },
// //   img: {},
// //   ctn: {},
// //   row: {},
// //   col: {},
// //   cat: prdTemplate('cat'),
// //   dish: prdTemplate('dish'),
// //   drink: prdTemplate('drink'),
// //   product: prdTemplate('product'),
// //   filter: { render: 'filter' },
// //   header: { children: [{ prop: 'title' }, { prop: 'desc' }] },
// // };

// export const forEachBox = (boxes: Box[]) => {

// }

// export class BList {
//   bs: B[];

//   constructor(bs: B[]) {
//     this.bs = bs;
//   }

//   query(selector: string | ((b: B) => boolean)) {
//     const bs: B[] = [];
//     this.bs.forEach((b) => b.query(selector).forEach((b) => bs.push(b)));
//     return new BList(bs);
//   }

//   forEach(cb: (value: B, index: number, array: B[]) => void) {
//     this.bs.forEach(cb);
//     return this;
//   }

//   map<T>(cb: (value: B, index: number, array: B[]) => T): T[] {
//     return this.bs.map(cb);
//   }
// }

// export interface BoxUpdate {
//   id: string;
//   box: Box;
//   changes: Partial<BoxData>;
// }

// let _idGen = 0;

// export const selectedBoxes$ = flux<Dictionary<1>>({});
// export const onBoxClick$ = flux<Box|null>(null);
// export const onBoxUpdate$ = flux<BoxUpdate|null>(null);

// export const setElBox = (el: HTMLElement, box: Box) => {
//     (el as any)._box = box;
// }

// export const elBox = (el: HTMLElement|null) => {
//   while (el) {
//     const box = (el as any)._box as Box;
//     if (box) return box;
//     el = el.parentElement;
//   }
// }

// export default class Box {
//   // static renders: Record<string, (el: BElement, b: B) => void> = {
//   //   video: (el: BElement) => {
//   //     console.debug('TODO B render video', el);

//   //     // const b = el._b!;
//   //     // const videoEl = el as HTMLVideoElement;
//   //     // videoEl.innerHTML = '';

//   //     // const mediaId = toStr(b.d.video).split('/')[0] || '';
//   //     // if (!mediaId) return;

//   //     // const coverUrl = B.url(mediaId + '/cover.jpg');
//   //     // const webmUrl = B.url(mediaId + '/video.webm');
//   //     // const mp4Url = B.url(mediaId + '/video.mp4');

//   //     // videoEl.style.backgroundImage = `url('${coverUrl}')`;

//   //     // const webm = createEl('source');
//   //     // webm.src = webmUrl;
//   //     // webm.type = 'video/webm';
//   //     // videoEl.append(webm);

//   //     // const mp4 = createEl('source');
//   //     // mp4.src = mp4Url;
//   //     // mp4.type = 'video/mp4';
//   //     // videoEl.append(mp4);

//   //     // b.click = b.d.click || 'playPause';

//   //     // videoEl.play().catch(() => {
//   //     //   videoEl.oncanplay = () => {
//   //     //     videoEl.play();
//   //     //     videoEl.oncanplay = null;
//   //     //   };
//   //     // });
//   //   },
//   //   cl: (el: BElement) => {
//   //     el.classList.add('cl');
//   //     el.innerHTML = `<i>${el._d!.cl}</i><u>cl</u>`;
//   //   },
//   //   tPrices: (el: BElement) => {
//   //     el.classList.add('tPrices');
//   //     el.innerHTML = toArray(el._d!.tPrices, []).map(tPriceToHtml).join('');
//   //   },
//   //   prices: (el: BElement) => {
//   //     el.classList.add('prices');
//   //     el.innerHTML = toArray(el._d!.prices, []).map(priceToHtml).join('');
//   //   },
//   //   lang: (el: BElement, b: B) => {
//   //     const lang = b.d.lang;
//   //     el.style.backgroundImage = `url(${B.url(`flags/${lang}.svg`)})`;
//   //     el._b!.click = `app.setLang("${lang}")`;
//   //   },
//   //   icons: (el: BElement, b: B) => {
//   //     el.innerHTML = '';
//   //     el.classList.add('icons');
//   //     const icons = b.d.icons || [];
//   //     icons.forEach((tag) => {
//   //       const iconEl = document.createElement('div');
//   //       iconEl.className = 'icon';
//   //       iconEl.style.backgroundImage = `url(${B.url(`icons/${tag}.svg`)})`;
//   //       el.appendChild(iconEl);
//   //     });
//   //   },
//   //   carousel: (el: BElement, b: B) => {
//   //     clearInterval(b.timer);

//   //     const delayMs = (b.d.delay || 0) * 1000;
//   //     const durationMs = (b.d.duration || 10) * 1000;

//   //     if (durationMs > 0) {
//   //       const refresh = () => {
//   //         if (b.d.t !== 'carousel' && b.d.t !== 'pdf') {
//   //           clearInterval(b.timer);
//   //           return;
//   //         }
//   //         const len = el.children.length;
//   //         if (!len) return;
//   //         const curr = (b.curr = (toNbr(b.curr, -1) + 1) % len);
//   //         const last2 = (curr + len - 2) % len;
//   //         const last = (curr + len - 1) % len;
//   //         const next = (curr + 1) % len;
//   //         const reset = { last: false, curr: false, next: false };
//   //         if (b.d.t === 'pdf') el.classList.add('carousel');
//   //         setCls(el.children[last2], { ...reset }, true);
//   //         setCls(el.children[last], { ...reset, last: true }, true);
//   //         setCls(el.children[next], { ...reset, next: true }, true);
//   //         setCls(el.children[curr], { ...reset, curr: true }, true);
//   //       };
//   //       b.timer = setInterval(() => {
//   //         clearInterval(b.timer);
//   //         b.timer = setInterval(refresh, durationMs);
//   //         refresh();
//   //       }, delayMs);
//   //     }
//   //   },
//   //   prd: (el: BElement, b: B) => {
//   //     const count = b.count;
//   //     setCls(el, { prd: true, 'prd-added': count }, true);
//   //     if (!B.hasCart) return;
//   //     if (b.d.t === 'cat') return;
//   //     b.click = 'b.addToCart()';
//   //   },
//   //   count: (el: BElement, b: B) => {
//   //     const count = b.count || 0;
//   //     setCls(el, { count: 1, count0: !count }, true);
//   //     el.innerHTML = String(count);
//   //   },
//   //   filter: (_el: BElement, b: B) => {
//   //     if (b.off) b.off();
//   //     b.off = B.update$.on(() => b.render(true));

//   //     const cb = getCallCb(b.d.filter);
//   //     const list = query(cb as (b: B) => boolean);

//   //     b.el.innerHTML = '';
//   //     b.children.forEach((b) => b.dispose());
//   //     b.children = list.map((b) => new B(b.d, b).render(true));
//   //   },
//   // };

//   // static readonly props = props;

//   // static dLang(d: D, lang: string = '') {
//   //   try {
//   //     if (d.l !== lang) {
//   //       d.l = lang;
//   //       const dTr = d.tr ? d.tr[lang] : null;
//   //       if (dTr) Object.assign(d, dTr);
//   //       if (d.children) {
//   //         for (const child of d.children) {
//   //           B.dLang(child, lang);
//   //         }
//   //       }
//   //     }
//   //   } catch (e) {
//   //     const error = toErr(e);
//   //     console.error('dLang', d, lang, error);
//   //   }
//   // }

//   // static url(key: string) {
//   //   console.debug('TODO url', key);
//   //   return '';
//   //   // if (!key || typeof key !== 'string') return '';
//   //   // if (key.startsWith('http')) return key;
//   //   // if (key.match(/^\d{1,5}\//)) {
//   //   //   key = key.replace('/sd.', '/720x720.');
//   //   //   // return `${config.assetUrl}/${key}?v=${BUILD_HASH}`;
//   //   // }
//   //   // return `${config.mediaUrl}/${key}?v=${BUILD_HASH}`;
//   // }

//   data: BoxData = {};

//   children?: Box[] = [];
//   parent?: Box;
//   el: HTMLElement;

//   protected constructor(data: BoxData, parent?: Box) {
//     this.data = data;

//     this.el = this.reset(d.hTag || B.hTag);
//     this.parent = parent;
//     this.children = d.children ? d.children.map((d) => new B(d, this)) : [];
//     this._onClick = this.onClick.bind(this);
//     this.update$.on((update) => B.update$.set(update));
//   }

//   set<K extends keyof D>(prop: K, value: D[K]) {
//     this.update({ [prop]: value });
//   }

//   get<K extends keyof D>(prop: K): D[K] {
//     return this.d[prop];
//   }

//   setData(d: D) {
//     this.dispose();
//     this.d = toItem(d, {});
//     const parent = this.parent;
//     if (parent) {
//       const index = parent.children.indexOf(this);
//       parent.d.children![index] = d;
//     }
//     this.update$.set({ b: this, d });
//     this.render(true);
//   }

//   update(changes: Partial<D>) {
//     Object.assign(this.d, changes);
//     this.update$.set({ b: this, d: changes });
//     this.render(!!changes.children);
//   }

//   updateStyle(changes: Partial<DStyle>) {
//     this.update({ style: { ...this.d.style, ...changes } });
//   }

//   protected reset(hTag: string) {
//     let el = this.el;
//     if (el) {
//       if (el.tagName.toLowerCase() === hTag) {
//         for (const name of el.getAttributeNames()) {
//           el.removeAttribute(name);
//         }
//         el.innerHTML = '';
//         el.onclick = this._onClick;
//         el.ontouchend = this._onClick;
//         if (B.bCls) el.className = B.bCls;
//         return el;
//       }
//       el.remove();
//     }
//     el = createEl(hTag);
//     el.onclick = this._onClick;
//     el.ontouchend = this._onClick;
//     // el.ontouchstart = this.onClick.bind(this);
//     if (B.bCls) el.className = B.bCls;
//     el._b = this;
//     el._d = this.d;
//     return (this.el = el);
//   }

//   protected apply(el: BElement, d?: D) {
//     if (!d) return;
//     for (const [prop, val] of Object.entries(d)) {
//       const apply = props[prop as keyof D];
//       if (apply) apply(el, val, this);
//     }
//   }

//   protected applyTpl(parentEl: BElement, tplName: string, children?: D[]) {
//     if (!children) return;
//     for (const d of children) {
//       // Create Element Child
//       const el = createEl('div') as BElement;
//       el._b = this;
//       el._d = d;
//       parentEl.appendChild(el);

//       // Template Prop
//       if (d.prop) {
//         if (d.prop === 'children') {
//           this.cEl = el;
//           continue;
//         }
//         const v = this.get(d.prop) as any;
//         if (v === undefined) continue;
//         if (d.propLink) (d as any)[d.propLink as any] = v;
//         else d.ctn = v;
//       }

//       this.apply(el, d);

//       if (d.prop) el.classList.add('p-' + d.prop);
//       this.applyTpl(el, tplName, d.children);
//     }
//   }

//   render(isRecursive: boolean = true) {
//     const data = this.d;
//     try {
//       B.dLang(data, B.l);
//       const tplName = data.t || '';
//       const tpl = B.templates[tplName];

//       if (isRecursive) {
//         const dChildren = data.children || [];
//         const bChildren = this.children;
//         if (dChildren.length !== bChildren.length) {
//           bChildren.forEach((b) => b.dispose());
//           this.children = dChildren.map((d) => new B(d, this).render());
//         } else {
//           dChildren.forEach((d, i) => {
//             if (bChildren[i].d !== d) bChildren[i] = new B(d, this);
//             bChildren[i].render();
//           });
//         }
//       }

//       if (tpl) {
//         B.dLang(tpl, B.l);
//         const el = this.reset(tpl.hTag || data.hTag || B.hTag);
//         this.apply(el, tpl);
//         this.apply(el, data);
//         this.applyTpl(el, tplName, deepClone(tpl.children));
//         if (tpl.render) this.callRender(el, tpl.render);
//         if (data.render) this.callRender(el, data.render);
//         this.children.forEach((b) => (this.cEl || this.el).appendChild(b.el));
//       } else {
//         const el = this.reset(data.hTag || B.hTag);
//         this.apply(el, data);
//         if (data.render) this.callRender(el, data.render);
//         this.children.forEach((b) => this.el.appendChild(b.el));
//       }
//     } catch (e) {
//       const error = toErr(e);
//       console.error('render', this, error);
//     }
//     return this;
//   }

//   _onClick: typeof this.onClick;

//   click?: DCall;
//   onClick(event?: MouseEvent | TouchEvent) {
//     console.debug('onClick', event);
//     if (event) {
//       event.preventDefault();
//       event.stopPropagation();
//     }
//     this.call(this.el, this.click);
//     B.select$.set(this);
//     B.click$.set(this);
//   }

//   callRender(el: BElement, name: string) {
//     try {
//       const fun = B.renders[name];
//       if (fun) return fun(el, el._b!);
//       throw 'undefined';
//     } catch (e) {
//       const error = toErr(e);
//       console.error('B.callRender', this, name, error);
//     }
//   }

//   call(el: BElement | null, script?: DCall) {
//     try {
//       console.debug('TODO call', el, script);
//       // app.callEl = el || B.root.el;
//       // getCallCb(script)(this, el || this.el, app);
//     } catch (e) {
//       const error = toErr(e);
//       console.error('B.call', this, script, error);
//       return this;
//     }
//   }

//   dispose() {
//     if (this.off) this.off();
//     if (this.timer) clearInterval(this.timer);
//     this.children.forEach((b) => b.dispose());
//     this.children.length = 0;
//   }

//   find(cb: string | ((b: B) => any)): B | undefined {
//     if (typeof cb !== 'function') {
//       const o: any = toItem(cb, { id: cb });
//       cb = (b: B) => {
//         const d = b.d as any;
//         for (const prop in o) {
//           if (!isEq(d[prop], o[prop])) return false;
//         }
//         return true;
//       };
//     }
//     if (cb(this)) return this;
//     for (const child of this.children) {
//       const b = child.find(cb);
//       if (b) return b;
//     }
//   }

//   forEach(cb: (b: B) => any) {
//     cb(this);
//     this.children.forEach((c) => c.forEach(cb));
//   }

//   cls(cls: Cls | string, active?: boolean | number) {
//     if (typeof cls === 'string') cls = { [cls]: active };
//     setCls(this.el, true);
//     this.update$.set({ b: this, cls });
//     return this;
//   }

//   hasCls(name: string) {
//     return this.el.classList.contains(name);
//   }

//   toggle(name: string) {
//     return this.cls(name, !this.hasCls(name));
//   }

//   query(selector: string | ((b: B) => boolean), el?: HTMLElement | null) {
//     const results: B[] = [];
//     if (typeof selector === 'string') {
//       for (const childEl of (el || (this.el as any)).querySelectorAll(selector)) {
//         const b = (childEl as BElement)._b;
//         if (b) results.push(b);
//       }
//     } else {
//       this.forEach((b) => selector(b) && results.push(b));
//     }
//     return new BList(results);
//   }
// }

// function query(selector: string | ((b: B) => boolean)) {
//   return B.root.query(selector, B.root.el.parentElement);
// }

// // TODO

// // function setLang(lang: string) {
// //   if (B.l) bodyClass.remove('l-' + B.l);
// //   if (!lang) lang = B.lSource;
// //   bodyClass.add('l-' + lang);
// //   B.l = lang;
// //   B.root.render(true);
// //   return lang;
// // }

// // function setPage(page: string) {
// //   const isAdmin = !!router.current.params.adminPage;
// //   const siteKey = router.current.params.siteKey;
// //   const path = page ? `/${siteKey}/${page}` : `/${siteKey}`;
// //   router.push(isAdmin ? `/admin${path}` : path);
// //   return page;
// // }

// // app.query = query;
// // app.setLang = setLang;
// // app.setPage = setPage;
// // app.find = (cb: string|((b: B) => any)) => app.B.root.find(cb);

// // app.playPause = (b: B) => {
// //   try {
// //     const el = b.el as HTMLVideoElement;
// //     if (!el.play) return;
// //     if (el.paused) el.play();
// //     else el.pause();
// //   }
// //   catch (error) {
// //     console.warn('playPause', error);
// //   }
// // }

// bodyClass.add('l-' + B.l);
// // app.B = B;

// const bodyClasses: string[] = [];

// B.page$.on((newPage) => {
//   // oldPage.split('+').forEach((p) => bodyClass.remove('page-' + p));
//   // newPage.split('+').forEach((p) => bodyClass.add('page-' + p));
//   B.root.forEach((b) => b.d.page && b.render(true));

//   const classList = document.body.classList;
//   bodyClasses.forEach((cls) => classList.remove(cls));

//   bodyClasses.length = 0;

//   const siteKey = router.current.params.siteKey;
//   if (siteKey) bodyClasses.push(siteKey);
//   // bodyClasses.push('site');

//   newPage.split('+').forEach((page) => bodyClasses.push('page-' + page));

//   bodyClasses.forEach((cls) => classList.add(cls));
// });

// const onRouterUpdated = () => {
//   B.page$.set(router.current.params.sitePage || B.home);
// };

// onRouterUpdated();
// router.updated$.on(onRouterUpdated);
