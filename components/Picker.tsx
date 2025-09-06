import { ComponentChildren } from 'preact';
import { useCss } from '../hooks/useCss';
import { Css } from '../helpers/html';
import { flexRow } from '../helpers/flexBox';
import { Div } from './Div';
import { Button } from './Button';
import { isList } from '../helpers/check';

const css: Css = {
  '&': {
    ...flexRow({ align: 'center', justify: 'center', wrap: 'wrap' }),
    w: '100%',
    p: 0,
    border: 0,
  },
  '& .Button': {
    m: 0,
    p: 0,
    hMin: '1em',
  },
  '& .Button .ButtonIcon': {
    wh: '1em',
    bg: 'transparent',
  },
};

export interface PickerProps {
  cls?: string;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  items?: ([string, ComponentChildren] | false | null | undefined)[];
  props?: any;
}

export const Picker = ({
  cls,
  name,
  required,
  value = '',
  onChange,
  items = [],
  ...props
}: PickerProps) => {
  const c = useCss('Picker', css);

  const validItems = items.filter((item) => isList(item)) as [string, ComponentChildren][];

  const handleIconClick = (iconValue: string) => {
    onChange?.(iconValue);
  };

  return (
    <Div cls={[c, cls]} {...props}>
      {/* Hidden input for form compatibility */}
      <input
        name={name}
        required={required}
        value={value}
        style={{ display: 'none' }}
        tabIndex={-1}
      />

      {validItems.map(([key, icon]) => (
        <Button
          key={key}
          icon={icon}
          selected={key === value}
          color={key === value ? 'primary' : undefined}
          onClick={() => handleIconClick(key)}
          // title={key} // Tooltip showing the key/value
        />
      ))}
    </Div>
  );
};
