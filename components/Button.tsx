import { ComponentChildren, JSX } from 'preact';
import { useRef } from 'preact/hooks';
import { Css } from '@common/ui/css';
import { Tr } from './Tr';

const c = Css('Button', {
  '': {
    fRow: ['center', 'start'],
    position: 'relative',
    m: 0.2,
    p: 0,
    rounded: 2,
    border: 'none',
    bg: 'button',
    fg: 'fg',
    wMin: 2.2,
    hMin: 2.2,
    elevation: 1,
    transition: 0.5,
  },
  Sfx: {
    position: 'absolute',
    inset: 0,
    bg: 'bg',
    transition: 0.5,
    scaleX: 0,
    transformOrigin: 'left',
    rounded: 2,
  },
  Content: {
    position: 'relative',
    fRow: ['center', 'start'],
    mr: 0.5,
    flex: 1,
    textAlign: 'left',
  },

  '-icon': {
    m: 0,
  },
  '-icon &Content': {
    display: 'none',
  },
  Icon: {
    position: 'relative',
    fCenter: 1,
    wMin: 2.2,
    hMin: 2.2,
    rounded: 2,
  },

  '-primary': { bg: 'p40', fg: 'bg' },
  '-secondary': { bg: 's40', fg: 'bg' },
  '-success': { bg: 'success', fg: 'bg' },
  '-warn': { bg: 'warn', fg: 'bg' },
  '-error': { bg: 'error', fg: 'bg' },

  // '-primary &Icon': { fg: 'bg' },
  // '-secondary &Icon': { fg: 'bg' },
  // '-success &Icon': { fg: 'bg' },
  // '-warn &Icon': { fg: 'bg' },
  // '-error &Icon': { fg: 'bg' },

  ':hover': { fg: 'fg', elevation: 0 },

  ':hover, &-selected': { fg: 'selected' },

  ':hover &Sfx, &-selected &Sfx': { scaleX: 1 },

  ':active &Sfx': { elevation: 0 },
});

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warn' | 'error';
  variant?: 'upload';
  selected?: boolean;
  icon?: ComponentChildren;
  before?: ComponentChildren;
  title?: string;
}

export const Button = ({
  title,
  color,
  variant,
  selected,
  icon,
  children,
  before,
  onClick,
  ...props
}: ButtonProps) => {
  const isIcon = icon && !(children || title);

  return (
    <button
      onClick={onClick}
      {...props}
      class={c(
        '',
        color && `-${color}`,
        selected && `-selected`,
        isIcon && `-icon`,
        variant && `-${variant}`,
        props
      )}
    >
      <div class={c('Sfx')} />
      {before}
      {icon && <div class={c('Icon')}>{icon}</div>}
      <div class={c('Content')}>
        {title && <Tr>{title}</Tr>}
        {children}
      </div>
    </button>
  );
};

export interface UploadButtonProps extends ButtonProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  icon?: ComponentChildren;
}

export const UploadButton = ({
  onClick,
  onFiles,
  accept,
  multiple,
  ...props
}: UploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      variant="upload"
      onClick={(event) => {
        if (onClick) onClick(event);
        inputRef.current?.click();
      }}
      {...props}
      before={
        <input
          style={{ display: 'none' }}
          type="file"
          ref={inputRef}
          accept={accept}
          multiple={multiple || true}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            const files = Array.from(target.files || []);
            if (onFiles) onFiles(files);
            if (inputRef.current) inputRef.current.value = '';
          }}
        />
      }
    />
  );
};
