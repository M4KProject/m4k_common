import { ComponentChildren } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Css } from '@common/ui/css';
import { isList } from '@common/utils/check';
import { isSearched } from '@common/utils/str';
import { ChevronDown } from 'lucide-react';

const c = Css('Select', {
  '': {
    position: 'relative',
    fCol: ['stretch', 'start'],
    w: '100%',
  },
  Container: {
    fRow: [],
    wh: '100%',
    border: '1px solid',
    bColor: 'g2',
    rounded: 1,
    bg: 'b0',
    cursor: 'pointer',
  },
  'Container:hover': {
    bColor: 'p5',
    elevation: 1,
  },
  'Container:focus-within': {
    bColor: 'p5',
    elevation: 1,
  },
  Input: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    hMin: 1.5,
  },
  InputText: {
    position: 'absolute',
    xy: 0,
    wh: '100%',
    fRow: ['center', 'start'],
    pl: 0.5,
  },
  Dropdown: {
    position: 'absolute',
    y: '100%',
    mt: 0.2,
    x: 0,
    w: '100%',
    bg: 'b1',
    fg: 't1',
    border: '1px solid',
    bColor: 'g2',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    hMax: 10,
    overflowY: 'auto',
    zIndex: 1000,
    elevation: 2,
  },
  Option: {
    py: 0.5,
    px: 1,
    cursor: 'pointer',
    transition: 0.2,
  },
  'Option:hover': {
    bg: '#f5f5f5',
  },
  'Option-selected': {
    bg: '#e3f2fd',
    fg: '#1976d2',
  },
  'Option-highlighted': {
    bg: '#e8f4fd',
  },
  Arrow: {
    fCenter: [],
    w: 1.5,
    h: 1.5,
    opacity: 0.6,
    transition: 0.3,
    lineHeight: 1,
    pointerEvents: 'none',
    flexShrink: 0,
  },
  '-open &Arrow': {
    transform: 'rotate(180deg)',
  },
});

export interface SelectProps {
  class?: string;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  items?: ([string, ComponentChildren] | false | null | undefined)[];
  placeholder?: string;
  searchable?: boolean;
  props?: any;
}

export const Select = ({
  name,
  required,
  value = '',
  onChange,
  items = [],
  placeholder = 'Sélectionner...',
  searchable = true,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const validItems = items.filter((item) => isList(item)) as [string, ComponentChildren][];

  const filteredItems =
    searchable && search ?
      validItems.filter(
        ([key, label]) =>
          isSearched(key, search) || (typeof label === 'string' && isSearched(label, search))
      )
    : validItems;

  const selectedItem = validItems.find(([key]) => key === value);
  const displayValue = selectedItem ? selectedItem[1] : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && searchable) {
      setSearch('');
    }
  };

  const handleInputChange = (e: Event) => {
    if (!searchable) return;
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
        if (!isOpen) setIsOpen(true);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
        if (!isOpen) setIsOpen(true);
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleOptionClick(filteredItems[highlightedIndex][0]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={dropdownRef} {...props} class={c('', isOpen && `-open`, props)}>
      <div class={c('Container')} onClick={handleInputClick}>
        {searchable && isOpen ?
          <input
            ref={inputRef}
            class={`${c}Input`}
            name={name}
            required={required}
            value={search}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autocomplete="off"
            onClick={(e) => e.stopPropagation()}
          />
        : <div class={c('Input')} onKeyDown={handleKeyDown}>
            <div class={c('InputText')}>{displayValue || placeholder}</div>
            <input
              ref={inputRef}
              name={name}
              required={required}
              value={value || ''}
              style={{ display: 'none' }}
              tabIndex={-1}
            />
          </div>
        }
        <div class={c('Arrow')}>
          <ChevronDown />
        </div>
      </div>

      {isOpen && (
        <div class={c('Dropdown')}>
          {filteredItems.length === 0 ?
            <div class={c('Option')}>Aucun résultat</div>
          : filteredItems.map(([key, label], index) => (
              <div
                key={key}
                class={c(
                  `Option`,
                  key === value && `Option-selected`,
                  index === highlightedIndex && `Option-highlighted`
                )}
                onClick={() => handleOptionClick(key)}
              >
                {label}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};
