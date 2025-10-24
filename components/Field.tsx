import { Css } from '@common/ui/css';
import { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { toNbr } from '@common/utils/cast';
import { DivProps } from './types';
import { Tr } from './Tr';
import { Select } from './Select';
import { Picker } from './Picker';
import { toError } from '@common/utils/cast';
import { Check, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { Msg } from '@common/utils/Msg';
import { useMsg } from '../hooks';
import { TMap } from '@common/utils/types';
import { formatSeconds, parseSeconds } from '@common/utils/date';

const c = Css('Field', {
  '': {
    fRow: ['center'],
    my: 0.4,
    w: '100%',
  },
  Group: {
    fRow: ['center', 'space-between'],
  },
  '-col': {
    fCol: ['stretch'],
  },
  '-error &Label': { fg: 'error' },
  '-error &Input': { border: 'error' },
  Error: { fg: 'error' },
  Label: {
    // flex: 1,
    textAlign: 'left',
    opacity: 0.6,
    fg: 't2',
    w: 12,
  },
  Content: {
    fRow: ['center', 'start'],
    flex: 2,
    hMin: 2,
  },
  Input: {
    w: '100%',
    h: 2,
    py: 0.2,
    px: 1,
    border: '1px solid',
    bColor: 'g2',
    rounded: 2,
    outline: 'none',
    bg: 'b1',
    fg: 't1',
    fontSize: '1rem',
    // elevation: 1,
  },
  'Input:hover': {
    borderColor: '#777',
  },

  // Régle la couleur de l'autocompletion
  'Input:autofill': {
    '-webkit-text-fill-color': 'black',
    '-webkit-box-shadow': '0 0 0 1000px white inset',
    'caret-color': 'black',
  },

  '-check &Input': {
    fCenter: [],
    p: 0,
    w: 1.4,
    h: 1.4,
    cursor: 'pointer',
    border: '1px solid',
    bColor: 'g2',
    bg: 'b1',
    position: 'relative',
    rounded: 1,
    transition: 0.3,
    boxSizing: 'border-box',
  },
  '-check &Input-selected': {
    bColor: 'p5',
    bg: 'p5',
  },
  '-check &Input svg': {
    fg: 'w1',
    transition: 0.3,
    transform: 'scale(0)',
  },
  '-check &Input-selected svg': {
    transform: 'scale(1)',
  },

  '-switch &Input': {
    fCenter: [],
    w: 2,
    h: 1.5,
    cursor: 'pointer',
    border: '1px solid',
    bColor: 'g2',
    bg: 'b1',
    position: 'relative',
    borderRadius: '999px',
    transition: 0.3,
  },
  '-switch &Input-selected': { bColor: 'p6', bg: 'p5' },

  '-switch &InputHandle': {
    w: 1.2,
    h: 1.2,
    bg: 'w0',
    borderRadius: '50%',
    position: 'absolute',
    elevation: 1,
    transition: 0.3,
    translateX: '-1em',
  },
  '-switch &Input-selected &InputHandle': { translateX: '1em' },
});

export type FieldComp<T = any> = (props: {
  cls?: string;
  name: string | undefined;
  required?: boolean;
  value: T;
  onChange: (e: any) => void;
  onBlur?: () => void;
  fieldProps: FieldProps<T>;
}) => ComponentChildren;

export type FieldType =
  | 'email'
  | 'password'
  | 'text'
  | 'multiline'
  | 'html'
  | 'color'
  | 'number'
  | 'select'
  | 'picker'
  | 'switch'
  | 'check'
  | 'image'
  | 'doc'
  | 'date'
  | 'datetime'
  | 'seconds';

export interface FieldInfo<T = any> {
  col?: boolean;
  type?: FieldType;
  name?: string;
  label?: ComponentChildren;
  helper?: ComponentChildren;
  error?: ComponentChildren;
  items?: ([T, ComponentChildren] | false | null | undefined)[];
  required?: boolean;
  readonly?: boolean;
  castType?: string;
  props?: any;
}

export interface FieldProps<T = any> extends FieldInfo, DivProps {
  msg?: Msg<T>;
  value?: T;
  cast?: (next: any) => T;
  onValue?: (next: T) => void;
  delay?: number;
}

export const castByType: TMap<(next: any) => any> = {
  number: (next: any) => {
    const casted = toNbr(next, null);
    if (casted === null) throw toError('not-a-number');
    return casted;
  },
  seconds: (next: any) => {
    const seconds = parseSeconds(next);
    if (seconds === null) throw toError('invalid-time-format');
    return seconds;
  },
};

export const formatByType: TMap<(value: any) => any> = {
  seconds: (value: any) => {
    if (typeof value === 'number') return formatSeconds(value);
    return value || '';
  },
};

const getMediaField = (_mimetypes: string[]): FieldComp => {
  // const mimetypeMap = by(mimetypes, m => m, () => true);
  return ({ cls, name, required, value, onChange, fieldProps }) => {
    // const medias = Object.values(useMsg(medias$));
    // const filteredMedias = medias.filter(m => mimetypeMap[m.mimetype]);
    // const groupId = useMsg(groupId$);
    return (
      <select
        name={name}
        required={required}
        value={value || ''}
        onChange={onChange}
        {...fieldProps.props}
        class={c(cls, fieldProps.props)}
      >
        {/* <option value="" className={!value ? `${cls}Selected` : undefined}></option>
                {Object.values(filteredMedias).map(media => (
                    <option key={media.id} value={media.id} className={media.id === value ? `${cls}Selected` : undefined}>
                        {media.name.replace(`${groupId}/`, '')}
                    </option>
                ))} */}
      </select>
    );
  };
};

const compByType: Record<FieldType, FieldComp> = {
  email: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="email"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
  password: ({ cls, name, required, value, onChange, fieldProps }) => {
    const [show, setShow] = useState(false);
    return (
      <>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          required={required}
          value={value || ''}
          onChange={onChange}
          {...fieldProps.props}
          class={c(cls, fieldProps.props)}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            setShow((s) => !s);
          }}
          icon={show ? <EyeOff /> : <Eye />}
        />
      </>
    );
  },
  color: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="color"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
  text: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="text"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
  number: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="number"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
  multiline: ({ cls, name, required, value, onChange, fieldProps }) => (
    <textarea
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      rows={5}
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
  html: ({ cls, name, required, value, onChange, fieldProps }) => (
    <textarea
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      rows={5}
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
  // select: ({ name, required, value, onChange, fieldProps }) => (
  //     <select class={cls} name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props}>
  //         {/* <option value=""></option> */}
  //         {fieldProps.items?.map(kv => (
  //             isList(kv) ? (
  //                 <option key={kv[0]} value={kv[0]} class={kv[0] === value ? `${cls}Selected` : undefined}>
  //                     {kv[1]}
  //                 </option>
  //             ) : null
  //         ))}
  //     </select>
  // ),
  select: ({ fieldProps, ...props }) => (
    <Select {...props} items={fieldProps.items} {...fieldProps.props} />
  ),
  picker: ({ fieldProps, ...props }) => (
    <Picker {...props} items={fieldProps.items} {...fieldProps.props} />
  ),
  switch: ({ cls, value, onChange, fieldProps }) => {
    return (
      <div
        onClick={() => onChange(!value)}
        {...fieldProps.props}
        class={c(cls, value && `${cls}-selected`, fieldProps.props)}
      >
        <div class={c(`${cls}Handle`)}></div>
      </div>
    );
  },
  check: ({ cls, value, onChange, fieldProps }) => {
    return (
      <div
        onClick={() => onChange(!value)}
        {...fieldProps.props}
        class={c(cls, value && `${cls}-selected`, fieldProps.props)}
      >
        <Check />
      </div>
    );
  },
  image: getMediaField(['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']),
  doc: getMediaField(['application/pdf']),
  date: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="date"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
  datetime: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="date"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
  seconds: ({ cls, name, required, value, onChange, onBlur, fieldProps }) => (
    <input
      type="text"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="00:00:00"
      {...fieldProps.props}
      class={c(cls, fieldProps.props)}
    />
  ),
};

export const Field = (props: FieldProps) => {
  const {
    col,
    type,
    name,
    label,
    helper,
    error,
    readonly,
    required,
    msg,
    value,
    cast,
    castType,
    onValue,
    delay,
    items,
    props: propsProps,
    ...divProps
  } = props;
  const valDelay = delay || type === 'switch' || type === 'check' ? 0 : delay;

  const msgVal = useMsg(msg);
  const val = msg ? msgVal : value;

  const handleValue = (casted: any) => {
    if (onValue) onValue(casted);
    if (msg) msg.set(casted);
  };

  const [initiated, setInitiated] = useState<any>(val);
  const [changed, setChanged] = useState<any>(undefined);
  const [sended, setSended] = useState<any>(undefined);
  const [valueError, setValueError] = useState<any>(undefined);

  const err = error ? error : valueError;

  const reset = () => {
    setInitiated(val);
    setChanged(undefined);
    setSended(undefined);
    setValueError(undefined);
  };

  useEffect(reset, [type, name]);

  // if sync value change -> reset
  useEffect(() => {
    if (sended !== undefined) {
      if (sended === val) return;
    } else {
      if (initiated === val) return;
    }
    // console.debug('Field value changed', name, initiated, '->', value);
    reset();
  }, [val]);

  // if next value change -> error or send
  useEffect(() => {
    // console.debug('Field changed', name, changed);
    setValueError(undefined);
    if (changed === undefined) return;
    if (changed === sended) return;
    const timer = setTimeout(
      () => {
        try {
          let casted = changed;
          const castTypeFun = castType && castByType[castType];
          const castFun = type && castByType[type];

          if (castTypeFun) casted = castTypeFun(casted);
          else if (cast) casted = cast(casted);
          else if (castFun) casted = castFun(casted);

          if (casted === sended) return;
          // console.debug('Field sync', name, sended, '->', casted);
          setSended(casted);
          handleValue(casted);
        } catch (error) {
          setValueError(error);
        }
      },
      valDelay === undefined ? 400 : valDelay
    );
    return () => clearTimeout(timer);
  }, [changed]);

  const handleChange = (e: any) => {
    // console.debug('Field handleChange', e);
    if (readonly) return;
    let next = typeof e === 'object' && e.target ? e.target.value : e;
    // console.debug('Field next', name, changed, '->', next);
    setChanged(next);
  };

  const handleBlur = () => {
    // On blur, reset to show the validated/formatted value
    if (changed !== undefined && sended !== undefined) {
      setChanged(undefined);
      setInitiated(sended);
    }
  };

  const Comp = compByType[type || 'text'] || compByType.text;

  const formatValue = (value: any) => {
    const format = type && formatByType[type];
    return format ? format(value) : value;
  };

  return (
    <div {...divProps} class={c('', col && '-col', type && `-${type}`, err && '-error', divProps)}>
      {label && <div class={c('Label')}>{label} :</div>}
      <div class={c('Content')}>
        <Comp
          cls={'Input'}
          name={name}
          value={formatValue(changed === undefined ? initiated : changed)}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          fieldProps={props}
        />
        {err ?
          <div class={c('Error')}>
            <Tr>{err}</Tr>
          </div>
        : helper ?
          <div class={c('Helper')}>{helper}</div>
        : null}
      </div>
    </div>
  );
};

export const FieldGroup = (props: DivProps) => <div {...props} class={c('Group', props)} />;

// //     type?: 'text'|'textarea'|'select';
// //     name: string;
// //     label?: string|ReactNode;
// //     value?: any;
// //     required?: boolean;
// //     values?: TMap<string|ReactNode>;
// //     onChange: (e: any, next: any) => void,
// //     error?: string,
// //     helperText?: string,
// //     className?: string,
// //     children?: ReactNode,

// export type SelectItems = TMap<ReactNode>|[string, ReactNode][]

// export interface SelectFieldProps<T> extends FieldProps<T> {
//     items?: () => T[]|Msg<T[]>|null,

//     addContent?: ReactNode,
//     emptyContent?: ReactNode,
//     onAdd?: () => any|Promise<any>,
// }

// const Field = ({ className, getItems, value$, emptyContent, addContent, onAdd }: FieldProps) => {
//     const cls = useCss('Field', css);
//     const [items, error, isLoading, refresh] = usePromise(getItems, []);
//     const selectedId = useMsg(selectedId$);

//     return (
//         <div className={className ? `${cls} ${className}` : cls}>
//             {isLoading ? (
//                 "Chargement..."
//             ) : error ? (
//                 <span>{error}</span>
//             ) : (
//
//             )}
//             <IconButton onClick={refresh}>
//                 <FcSynchronize />
//             </IconButton>
//         </div>
//     );
// };

// export default Input;
