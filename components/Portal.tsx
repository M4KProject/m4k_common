import { render } from 'preact';
import { El, ElOptions } from '../helpers/html';
import { ComponentChildren } from 'preact';

export const portal = (content: ComponentChildren, o?: ElOptions) => {
  const el = El('div', { parent: 'body', ...o });
  render(content, el);
  return el;
};
