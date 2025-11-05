import { Css, flux } from 'fluxio';
import { DivProps } from './types';
import { Button, ButtonProps } from './Button';
import { Menu } from 'lucide-react';
import { useFlux } from '@common/hooks';

const c = Css('Side', {
  '': {
    position: 'relative',
    transition: 0.2,
    elevation: 3,
    w: 34,
    bg: 'b0',
    zIndex: 50,
  },
  Mask: {
    position: 'absolute',
    x: 0,
    y: '50%',
    w: 34,
    h: '100%',
    zIndex: 100,
    overflow: 'hidden',
    translateY: '-50%',
    transition: 0.2,
  },
  Content: {
    col: 1,
    position: 'absolute',
    xy: 0,
    wMin: 160,
    h: '100%',
  },
  Button: {
    elevation: 0,
    my: 2,
  },

  ' .ButtonContent': {
    transition: 0.2,
    opacity: 1,
  },
  '-close .ButtonContent': {
    opacity: 0,
  },
  ' &Button-tab': {
    ml: 16,
    transition: 0.2,
  },
  '-close .Button': {
    ml: 2,
  },

  '-open': {
    w: 160,
  },
  '-open &Mask': {
    w: 160,
  },

  Sep: {
    col: ['start', 'end'],
    pl: 1,
    flex: 1,
    color: '#0a536f',
    bold: 1,
    // borderBottom: '1px solid #0a536f',
  },
});

export interface SideButtonProps extends ButtonProps {
  tab?: boolean;
}
export const SideButton = ({ tab, ...props }: SideButtonProps) => (
  <Button {...props} {...c('Button', tab && 'Button-tab', props)} />
);

export const SideSep = (props: DivProps) => <div {...props} {...c('Sep', props)} />;

export const sideOpen$ = flux(true);

export const Side = ({ children, ...props }: DivProps) => {
  const open = useFlux(sideOpen$);
  const toggleOpen = () => sideOpen$.set((open) => !open);
  return (
    <div {...props} {...c('', open ? '-open' : '-close', props)}>
      <div {...c('Mask')}>
        <div {...c('Content')}>
          <Button icon={<Menu />} onClick={toggleOpen}>
            Ouvrir
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
};
