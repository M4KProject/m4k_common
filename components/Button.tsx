import { ComponentChildren, JSX } from 'preact';
import { useRef } from 'preact/hooks';
import { Css } from '@common/ui/html';
import { Tr } from './Tr';

const c = Css('Button', {
  '': {
    fRow: ['center', 'start'],
    position: 'relative',
    m: 0.2,
    p: 0.2,
    rounded: 2,
    border: 'none',
    bg: 'transparent',
    fg: 'fg',
    hMin: 2.5,
  },
  Row: {
    fRow: ['center', 'space-around'],
  },
  '-icon': {
    m: 0,
  },
  Icon: {
    fCenter: 1,
    mx: 0.25,
    w: 1.4,
    h: 1.4,
    rounded: 2,
    bg: 'bg',
    fg: 'selected',
  },
  Content: {
    m: 0.25,
    flex: 1,
    textAlign: 'left',
  },
  Sfx: {
    position: 'absolute',
    inset: 0,
    bg: 'bg',
    zIndex: -1,
    transition: 'transform 0.5s ease',
    scaleX: 0,
    transformOrigin: 'left',
    rounded: 2,
    elevation: 1,
  },

  ':hover, &-selected': { fg: 'selected' },
  ':hover &Sfx, &-selected &Sfx': { scaleX: 1 },
  // ':hover &Content, &-selected &Content': { fontWeight: 'bold' },
  ':active &Sfx': { elevation: 0 },

  '-primary': { bg: 'primary', fg: 'bg' },
  '-secondary': { bg: 'secondary', fg: 'bg' },
  '-success': { bg: 'success', fg: 'bg' },
  '-warn': { bg: 'warn', fg: 'bg' },
  '-error': { bg: 'error', fg: 'bg' },

  '-primary &Icon': { bg: 'bg', fg: 'primary' },
  '-secondary &Icon': { bg: 'bg', fg: 'secondary' },
  '-success &Icon': { bg: 'bg', fg: 'success' },
  '-warn &Icon': { bg: 'bg', fg: 'warn' },
  '-error &Icon': { bg: 'bg', fg: 'error' },

  ':hover &Icon': { bg: 'selected', fg: 'bg' },
  '-primary:hover &Icon': { bg: 'primary', fg: 'bg' },
  '-secondary:hover &Icon': { bg: 'secondary', fg: 'bg' },
  '-success:hover &Icon': { bg: 'success', fg: 'bg' },
  '-warn:hover &Icon': { bg: 'warn', fg: 'bg' },
  '-error:hover &Icon': { bg: 'error', fg: 'bg' },
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
      {(title || children) && (
        <div class={c('Content')}>
          {title && <Tr>{title}</Tr>}
          {children}
        </div>
      )}
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
