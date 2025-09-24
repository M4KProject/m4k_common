import { useMsg } from '../hooks';
import { Css } from '@common/ui/css';
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
    elevation: 3,
    w: 3,
    bg: 'b0',
    zIndex: 50,
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
    wMin: 15,
    h: '100%',
  },
  Button: {
    elevation: 0,
    my: 0.25,
  },

  ' .ButtonContent': {
    transition: 0.2,
    opacity: 1,
  },
  '-close .ButtonContent': {
    opacity: 0,
  },
  // ' .Button': {
  //   mx: 0.5,
  // },
  ' &Button-tab': {
    ml: 2,
    transition: 0.2,
  },
  '-close .Button': {
    ml: 0.25,
  },

  '-open': {
    w: 15,
  },
  '-open &Mask': {
    w: 15,
  },

  Sep: {
    fCol: ['start', 'end'],
    pl: 1,
    flex: 1,
    color: '#0a536f',
    bold: 1,
    // borderBottom: '1px solid #0a536f',
  },
});

const SideContext = createContext<Msg<string> | null | undefined>(undefined);
const SideProvider = SideContext.Provider;

export interface SideButtonProps extends ButtonProps {
  page: string;
  tab?: boolean;
}
export const SideButton = ({ page, tab, title, children, ...props }: SideButtonProps) => {
  const page$ = useContext(SideContext);
  const curr = useMsg(page$);
  return (
    <Button
      title={title}
      selected={page === curr}
      onClick={() => page$?.set(page)}
      {...props}
      class={c('Button', tab && 'Button-tab', props)}
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
      <div {...props} class={c('', open ? '-open' : '-close', props)}>
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
