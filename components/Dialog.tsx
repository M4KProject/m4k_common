import { useMsg } from '../hooks/useMsg';
import { Css } from '@common/ui/css';
import { ComponentChildren } from 'preact';
import { Msg } from '@common/utils/Msg';
import { DivProps } from './types';
import { Tr } from './Tr';
import { portal } from './Portal';
import { useEffect, useState } from 'preact/hooks';
import { addTr } from '../hooks/useTr';

addTr({
  Error: 'Erreur',
  ReqError: 'Erreur serveur',
  'Failed to update record.': 'Échec de la modification.',
});

export const showDialog = (
  title: string,
  getContent: (open$: Msg<boolean>) => ComponentChildren,
  props?: Partial<DialogRenderProps>
) => {
  console.debug('showDialog', title);

  const open$ = new Msg(false);
  open$.on((v) => !v && setTimeout(() => el.remove(), 500));

  const el = portal(
    <DialogRender open$={open$} title={title} {...props}>
      <Tr>{getContent(open$)}</Tr>
    </DialogRender>
  );
};

const c = Css('Dialog', {
  '': {
    position: 'fixed',
    inset: 0,
    bg: 'mask',
    fCenter: 1,
    opacity: 0,
    transition: 0.5,
  },
  Window: {
    fCol: 1,
    elevation: 3,
    rounded: 4,
    wMin: 40,
    bg: 'b0',
    fg: 't2',
    scale: 0,
    transition: 0.5,
    p: 0.5,
  },
  Header: {
    fCenter: 1,
    m: 0.5,
  },
  HeaderText: {
    fg: 't3',
    bold: 1,
    fontSize: 2,
  },
  Content: {
    fCol: ['center'],
    m: 0.5,
  },

  '-open': {
    opacity: 1,
  },
  '-open &Window': {
    scale: 1,
  },
  '-error &Header': {
    fg: 'error',
  },
});

interface DialogRenderProps extends DivProps {
  open$: Msg<boolean>;
  variant?: 'error';
}
const DialogRender = ({ open$, variant, title, children, ...props }: DialogRenderProps) => {
  const open = useMsg(open$);
  const onClose = () => open$.set(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      open$.set(true);
    }, 10);
  }, []);

  useEffect(() => {
    if (open) setInit(true);
  }, [open]);

  return (
    <div class={c('', open && '-open', variant && `-${variant}`)} onClick={onClose} {...props}>
      <div class={c('Window')} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div class={c('Header')}>
            <div class={c('HeaderText')}>
              <Tr>{title}</Tr>
            </div>
          </div>
        )}
        <div class={c('Content')}>{init ? children : null}</div>
      </div>
    </div>
  );
};
