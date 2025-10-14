import { ComponentChildren, JSX } from 'preact';
import { useRef } from 'preact/hooks';
import { Css } from '@common/ui/css';
import { Tr } from './Tr';

const c = Css('Button', {
  '': {
    fRow: ['center', 'start'],
    position: 'relative',
    m: 0.25,
    p: 0.25,
    rounded: 2,
    border: 'none',
    bg: 'transparent',
    fg: 'w2',
    wMin: 2.2,
    hMin: 2.2,
    elevation: 1,
    transition: 0.5,
    bold: 1,
    fontSize: 'inherit',
  },
  Sfx: {
    position: 'absolute',
    inset: 0,
    bg: 's5',
    transition: 0.5,
    scaleX: 0,
    transformOrigin: 'left',
    rounded: 2,
  },
  Content: {
    position: 'relative',
    fRow: ['center', 'start'],
    m: 0.25,
    flex: 1,
    textAlign: 'left',
  },

  '-icon &Content': {
    display: 'none',
  },
  Icon: {
    position: 'relative',
    fCenter: [],
    m: 0.25,
    rounded: 2,
  },

  '-primary': { bg: 'p5' },
  '-secondary': { bg: 's4' },
  '-success': { bg: 'success' },
  '-warn': { bg: 'warn' },
  '-error': { bg: 'error' },
  '-default': { bg: 'b1', fg: 't2' },

  '-icon': { m: 0, bg: 'transparent', elevation: 0 },
  '-icon&-primary': { fg: 'p5' },
  '-icon&-secondary': { fg: 's4' },
  '-icon&-success': { fg: 'success' },
  '-icon&-warn': { fg: 'warn' },
  '-icon&-error': { fg: 'error' },
  '-icon&-default': { fg: 't2' },

  ':active': { bg: 'p4', fg: 'w2' },
  '-selected': { bg: 'p4', fg: 'w2' },

  ':hover &Sfx': { scaleX: 1 },
  ':hover': { elevation: 0, fg: 'w0' },
});

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warn' | 'error';
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
        `-${color || 'default'}`,
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
