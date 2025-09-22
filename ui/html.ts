export type Style = Partial<CSSStyleDeclaration>;

export type HTMLAllElement = HTMLDivElement &
  HTMLInputElement &
  HTMLVideoElement &
  HTMLImageElement &
  HTMLHeadingElement;

export const createEl: typeof document.createElement = (tagName, options) =>
  document.createElement(tagName, options);

const _cssFiles: Record<string, HTMLLinkElement> = {};
export const addCssFile = (url: string): HTMLLinkElement => {
  if (_cssFiles[url]) return _cssFiles[url];
  const el = createEl('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = url;
  _cssFiles[url] = document.head.appendChild(el);
  return el;
};

const _jsFiles: Record<string, HTMLScriptElement> = {};
export const addJsFile = (url: string): HTMLScriptElement => {
  if (_jsFiles[url]) return _jsFiles[url];
  const el = createEl('script');
  el.type = 'text/javascript';
  el.async = true;
  el.src = url;
  _jsFiles[url] = document.head.appendChild(el);
  return el;
};

export const waitScriptLoaded = (el: HTMLScriptElement): Promise<HTMLScriptElement> => {
  if ((el as any)._loaded) return (el as any)._loaded;

  (el as any)._loaded = new Promise<HTMLScriptElement>((resolve, reject) => {
    const state = (el as any).readyState;
    if (state === 'complete' || state === 'loaded') {
      resolve(el);
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error(`Loading script ${el.src} timed out after 60s`));
    }, 60000);

    addListener(
      el,
      'load',
      () => {
        clearTimeout(timer);
        resolve(el);
      },
      { once: true }
    );

    addListener(
      el,
      'error',
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
      { once: true }
    );
  });

  return (el as any)._loaded;
};

export const addJsFileAsync = (url: string) => waitScriptLoaded(addJsFile(url));

export const addListener = <
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  element: T | 0,
  type: K,
  listener: (this: T, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): (() => void) => {
  const el = element === 0 ? document.body : element;
  const handler = listener as (this: HTMLElement, ev: HTMLElementEventMap[K]) => any;
  el.addEventListener(type, handler, options);
  return () => el.removeEventListener(type, handler, options);
};

export const addListeners = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement | 0,
  listeners: Record<K, (this: HTMLElement, ev: HTMLElementEventMap[K]) => any>,
  optionsMap?: Record<K, boolean | AddEventListenerOptions>
): (() => void) => {
  const el = element === 0 ? document.body : element;
  for (const type in listeners) {
    el.addEventListener(type, listeners[type], optionsMap ? optionsMap[type] : undefined);
  }
  return () => {
    for (const type in listeners) {
      el.removeEventListener(type, listeners[type]);
    }
  };
};

export const autoScrollEnd = (el?: HTMLElement | null) => {
  if (!el) return;
  let lastUserScroll = 0;
  let isAutoScrolling = false;
  const timer = setInterval(() => {
    const isUserScroll = lastUserScroll + 5000 > Date.now();
    const scrollTopMax = el.scrollHeight - el.clientHeight;
    const isAtBottom = Math.abs(el.scrollTop - scrollTopMax) < 2;
    if (isUserScroll || isAtBottom) {
      isAutoScrolling = false;
      return;
    }
    isAutoScrolling = true;
    el.scrollTop = scrollTopMax;
    el.scrollLeft = 0;
  }, 200);
  const unsubscribe = addListener(el, 'scroll', () => {
    if (isAutoScrolling) return;
    const scrollTopMax = el.scrollHeight - el.clientHeight;
    const isAtBottom = Math.abs(el.scrollTop - scrollTopMax) < 5;
    lastUserScroll = isAtBottom ? 0 : Date.now();
  });
  return () => {
    clearInterval(timer);
    unsubscribe();
  };
};

export interface EventXY {
  x: number;
  y: number;
}

export const eventStop = (e: any) => {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
};

export const eventXY = (ev: MouseEvent | TouchEvent | Touch): EventXY => {
  const e = ev instanceof TouchEvent ? ev.touches[0] : ev;
  return e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 };
};

export const getAttrs = (el: Element) =>
  Object.fromEntries(el.getAttributeNames().map((name) => [name, el.getAttribute(name)]));

export const setAttrs = (el: Element, attrs: Record<string, any>, update?: boolean) => {
  if (!update) for (const a of Array.from(el.attributes)) el.removeAttribute(a.name);
  for (const n in attrs) el.setAttribute(n, attrs[n]);
};

export type Cls = Record<string, boolean | number | undefined | null>;

export const getCls = (el: Element): Cls =>
  Object.fromEntries(el.className.split(' ').map((k) => [k, true]));

export const setCls = (el: Element, cls: Cls | string, replace?: boolean) => {
  if (typeof cls === 'string') {
    el.className = cls;
    return;
  }
  if (replace) el.className = '';
  const list = el.classList;
  for (const name in cls) {
    const isAdd = cls[name];
    isAdd ? list.add(name) : list.remove(name);
  }
};

export const htmlToEl = (html: string) => {
  const el = createEl('div');
  el.innerHTML = html;
  return el.children[0];
};

export const setStyle = (el: HTMLElement, style: Style | string, update?: boolean) => {
  if (typeof style === 'string') return setAttrs(el, { style }, true);
  if (!update) setAttrs(el, { style: '' }, true);
  Object.assign(el.style, style);
};

export type ElOptions = Omit<Omit<Partial<HTMLAllElement>, 'children'>, 'style'> & {
  readonly reset?: boolean;
  readonly cls?: Cls;
  readonly style?: Style;
  readonly attrs?: Record<string, any>;
  readonly children?: HTMLElement[];
  readonly ctn?: string;
  readonly parent?: 'body' | HTMLElement;
};

export const El = (el: HTMLElement | keyof HTMLElementTagNameMap, o?: ElOptions) => {
  const id = o?.id;
  const last = id && document.getElementById(id);
  el = typeof el === 'string' ? last || createEl(el) : el;
  if (id) el.id = id;

  if (!o) return el;

  const { reset, attrs, style, cls, children, ctn, parent, ...rest } = o;

  if (reset) setAttrs(el, {});
  if (attrs) setAttrs(el, attrs, true);
  if (style) setStyle(el, style, true);
  if (cls) setCls(el, cls);
  if (ctn) el.innerHTML = ctn;
  if (parent) (parent === 'body' ? document.body : parent).appendChild(el);

  Object.assign(el, rest);

  if (children) for (const childEl of children) el.appendChild(childEl);

  return el;
};

export const setEl = (el: HTMLElement, options?: ElOptions) => El(el, options);
export const addEl = (tag: keyof HTMLElementTagNameMap = 'div', options?: ElOptions) =>
  El(tag, options);

// for (const el of els) el && containerEl.appendChild(el);
//     const el =  as HTMLElement;
//     return ;
// };

// export const newDialog = (options: ElOptions = {}) => {
//     setCss('mDialog', '.mDialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999999;' +
//         'min-width: 30%; max-width: 90%; min-height: 30%; max-height: 90%; overflow: auto; padding: 10px;' +
//         'background-color: white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); border-radius: 7px;' +
//         'display: flex; flex-direction: column; align-items: stretch; justify-content: space-around; }');
//     return setEl('div', { ...options, cls: { ...options.cls, mDialog: 1 } });
// }

// let progDialogEl: HTMLElement;
// export const newProg = ({ title, max, ...options }: Omit<ElOptions, 'max'> & { title: string, max?: number }) => {
//     if (!max) max = 100;
//     setCss('mProg',
//         '.mProg { border-radius: 5px; margin: 5px; }' +
//         '.mProgTitle { text-align: center; font-weight: bold; font-size: 1.2rem; margin: 5px; color: #666666; }' +
//         '.mProgTitle b { font-weight: bold; font-size: 2rem; margin-right: 5px; color: #0072c3; }' +
//         '.mProgBar { height: 1rem; background: #e0e0e0; border-radius: 99px; overflow: hidden; margin: 5px; }' +
//         '.mProgVal { height: 100%; width: 0%; background: #0043ce; border-radius: 99px; transition: all 0.5s; }'
//     );
//     const valEl = setEl('div', { cls: { mProgVal: 1 } });
//     const barEl = setEl('div', { cls: { mProgBar: 1 }, children: [valEl] });
//     const titleEl = setEl('span', { cls: { mProgTitle: 1 }, ctn: title });
//     const el = setEl('div', {
//         ...options,
//         cls: { ...options.cls, mProg: 1 },
//         children: [titleEl, barEl],
//     });
//     const dialogEl = progDialogEl || (progDialogEl = newDialog());
//     let timeoutId: any;
//     let curr: number = -1;
//     const set = (value: number) => {
//         clearTimeout(timeoutId);
//         if (value >= max) value = max;
//         if (curr === value) return;
//         curr = value;
//         if (!dialogEl.parentElement) document.body.append(dialogEl);
//         if (!el.parentElement) dialogEl.append(el);
//         valEl.style.width = (100*value/max) + '%';
//         setEl(titleEl, { ctn: `<b>${round(100*value/max)}%</b>${title}` });
//         if (value !== max) return;
//         timeoutId = setTimeout(() => {
//             el.remove();
//             if (dialogEl.children.length === 0) dialogEl.remove();
//         }, 1000);
//     };
//     set(0);
//     return set;
// }

export const setSiteTitle = (title: string) => {
  const titleEl = document.getElementsByTagName('title')[0];
  if (titleEl) titleEl.innerText = title;
  document.title = title;
};
