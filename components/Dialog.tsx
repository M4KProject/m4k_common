import { useMsg } from '../hooks/useMsg';
import { Css } from '@common/ui/css';
import { ComponentChildren } from 'preact';
import { Msg } from '@common/utils/Msg';
import { DivProps } from './Div';
import { Tr } from './Tr';
import { portal } from './Portal';
import { useEffect, useState } from 'preact/hooks';
import { addTr } from '../hooks/useTr';
import { isItem, ReqError, stringify, toError } from '@common/utils';

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

export const showError = (e: any) => {
  const error = toError(e);
  console.debug(
    'showError',
    error,
    error.message,
    error.name,
    (error as any).data,
    (error as any).ctx
  );
  if (error instanceof ReqError) {
    const message = error.data?.message || error.message;
    const data = error.data?.data;
    const props = console.debug('showError ReqError', message, error.data);
    showDialog(
      'ReqError',
      () => (
        <>
          <div>
            <Tr>{message}</Tr>
          </div>
          {isItem(data)
            ? Object.entries(data).map(([prop, value]) => (
                <div>
                  <Tr>{prop}</Tr>: <Tr>{value.message}</Tr>
                </div>
              ))
            : stringify(data)}
        </>
      ),
      { variant: 'error' }
    );
  } else {
    showDialog('Error:' + error.name, () => error.message, { variant: 'error' });
  }
};

const c = Css('Dialog', {
  '': {
    position: 'fixed',
    inset: 0,
    bg: '#000000AA',
    fCenter: 1,
    opacity: 0,
    transition: 0.5,
  },
  Window: {
    fCol: 1,
    elevation: 3,
    rounded: 2,
    maxWidth: '80%',
    minWidth: '80%',
    overflow: 'hidden',
    bg: 'bg',
    fg: 'fg',
    scale: 0,
    transition: 0.5,
  },
  Header: {
    fCenter: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    m: 0,
    p: 1,
    bg: 'header',
    fg: 'headerTitle',
  },
  Content: {
    fCol: ['center'],
    m: 1,
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
            <Tr>{title}</Tr>
          </div>
        )}
        <div class={c('Content')}>{init ? children : null}</div>
      </div>
    </div>
  );
};
