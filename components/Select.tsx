import { ComponentChildren } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Css } from '@common/ui/css';
import { isList } from '@common/utils/check';
import { isSearched } from '@common/utils/str';

const c = Css('Select', {
  '': {
    position: 'relative',
    border: 0,
    p: 0,
  },
  Container: {
    fRow: 1,
    wh: '100%',
    border: '1px solid #ddd',
    rounded: 1,
    bg: 'bg',
    cursor: 'pointer',
  },
  'Container:hover': {
    borderColor: '#777',
  },
  'Container:focus-within': {
    borderColor: '#4a90e2',
    boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
  },
  Input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    bg: 'b1',
    fg: 't2',
    fontSize: 'inherit',
    lineHeight: 1,
    m: 0,
    p: 0,
    pl: 1,
  },
  Dropdown: {
    position: 'absolute',
    y: '100%',
    mt: 0.2,
    x: 0,
    w: '100%',
    bg: 'b1',
    fg: 't1',
    border: '1px solid #ddd',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    maxHeight: '200px',
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
    fCenter: 1,
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
    searchable && search
      ? validItems.filter(
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
        if (isOpen && highlightedIndex >= 0) {
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
        {searchable && isOpen ? (
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
        ) : (
          <div class={c('Input')} onKeyDown={handleKeyDown}>
            {displayValue || placeholder}
            <input
              ref={inputRef}
              name={name}
              required={required}
              value={value || ''}
              style={{ display: 'none' }}
              tabIndex={-1}
            />
          </div>
        )}
        <div class={c('Arrow')}>▼</div>
      </div>

      {isOpen && (
        <div class={c('Dropdown')}>
          {filteredItems.length === 0 ? (
            <div class={c('Option')}>Aucun résultat</div>
          ) : (
            filteredItems.map(([key, label], index) => (
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
          )}
        </div>
      )}
    </div>
  );
};
