import { useMsg } from '../hooks';
import { Css } from '@common/ui/html';
import { Msg } from '@common/utils/Msg';
import { DivProps } from './Div';
import { Button, ButtonProps } from './Button';
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { Menu } from 'lucide-react';

const c = Css('Side', {
  '': {
    position: 'relative',
    transition: 0.2,
    elevation: 1,
    w: 3,
    bg: 'side',
  },
  Mask: {
    position: 'absolute',
    x: 0,
    y: '50%',
    w: 3,
    h: '100%',
    zIndex: 100,
    overflow: 'hidden',
    translateY: '-50%',
    transition: 0.2,
  },
  Content: {
    fCol: 1,
    position: 'absolute',
    xy: 0,
    wMin: 13,
    h: '100%',
  },
  ' .ButtonContent': {
    transition: 0.2,
    opacity: 0,
  },

  '-open': {
    w: 13,
  },
  '-open &Mask': {
    w: 13,
  },
  '-open .ButtonContent': {
    opacity: 1,
  },

  Sep: {
    fCol: ['start', 'end'],
    pl: 1,
    flex: 1,
    color: '#0a536f',
    fontWeight: 'bold',
    // borderBottom: '1px solid #0a536f',
  },

  '-editor': { w: 0 },
  '-editor &Mask': {
    w: 3,
    h: 18,
    bg: '#0090c87a',
    elevation: 1,
    borderRadius: '0 0.5em 0.5em 0',
  },
  '-editor &Sep': { visibility: 'hidden' },
});

const SideContext = createContext<Msg<string> | null | undefined>(undefined);
const SideProvider = SideContext.Provider;

export interface SideButtonProps extends ButtonProps {
  page: string;
}
export const SideButton = ({ page, title, children, ...props }: SideButtonProps) => {
  const page$ = useContext(SideContext);
  const curr = useMsg(page$);
  return (
    <Button
      title={title}
      selected={page === curr}
      onClick={() => page$?.set(page)}
      {...props}
      class={c('Button', props)}
    >
      {children}
    </Button>
  );
};

export interface SideSepProps extends DivProps {}
export const SideSep = (props: SideSepProps) => {
  return <div {...props} class={c('Sep', props)} />;
};

export interface SideProps extends DivProps {
  page$?: Msg<string> | null;
}
export const Side = ({ children, page$, ...props }: SideProps) => {
  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen((open) => !open);
  return (
    <SideProvider value={page$}>
      <div {...props} class={c('', open && '-open', props)}>
        <div class={c('Mask')}>
          <div class={c('Content')}>
            <Button icon={<Menu />} onClick={toggleOpen}>
              Ouvrir
            </Button>
            {children}
          </div>
        </div>
      </div>
    </SideProvider>
  );
};
