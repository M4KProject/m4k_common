import { CssRecord } from '../ui/css';
import { Dictionary } from 'fluxio';

export type BoxTranslates = Dictionary<BoxData>;

export type BoxScript = {
  // open?: string;
  // hideCategories?: string[];
  // showCategories?: string[];
  target?: number;
  url?: string;
  categories?: string[];
  js?: string;
};

export interface BoxData {
  children?: string[];

  // content
  type?: 'iframe' | 'video' | 'carousel' | 'html';
  url?: string;
  html?: string;
  mediaId?: string;
  duration?: number;
  // delay?: number;

  hide?: boolean;

  // absolute pos
  x?: number;
  y?: number;
  w?: number;
  h?: number;

  // style
  style?: CssRecord;
  class?: string;
  attrs?: Dictionary<string>;

  // filter
  categories?: string[];

  // events
  onInit?: BoxScript;
  onClick?: BoxScript;
  onRender?: BoxScript;

  // editor info
  meta?: {
    // title?: string;
    // desc?: string;
  };
}

export interface BoxDataReadonly extends Readonly<BoxData> {}
