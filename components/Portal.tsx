import { render } from 'preact';
import { El, ElOptions } from '@common/ui/html';
import { ComponentChildren } from 'preact';
import { logger } from '@common/utils/logger';

const log = logger('portal');

export const portal = (content: ComponentChildren, o?: ElOptions) => {
  const el = El('div', { parent: 'body', ...o });
  log.d('add', el);
  render(content, el);
  return () => {
    log.d('remove');
    render(null, el);
    el.remove();
  };
};
