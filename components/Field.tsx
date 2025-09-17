import { Css } from '../ui/html';
import { useCss } from '../hooks/useCss';
import { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { flexCenter, flexColumn, flexRow } from '../ui/flexBox';
import { toNbr } from '../utils/cast';
import { Div, DivProps } from './Div';
import { Tr } from './Tr';
import { Select } from './Select';
import { Picker } from './Picker';
import { toErr } from '../utils/err';
// import { useMsg } from "../hooks/useMsg";
// import { groupId$ } from "../api/repos";
// import { medias$ } from "../api/storage";
// import { by } from "../utils/by";
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { Msg } from '../utils/Msg';
import { useMsg } from '../hooks';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    w: '100%',
    // m: 0.5,
  },
  '&-row': {
    ...flexRow({ align: 'start' }),
  },
  '&-error &Label': { fg: 'error' },
  '&-error &Input': { border: 'error' },
  '&Error': { fg: 'error' },
  '&Label': {
    mt: 1,
    mb: 0.2,
    // flex: 1,
    textAlign: 'left',
    opacity: 0.6,
    fg: 'labelFg',
  },
  '&Content': {
    ...flexRow({ align: 'center', justify: 'start' }),
    flex: 2,
    hMin: 2,
  },
  '&Input': {
    w: '100%',
    h: 2,
    py: 0.2,
    px: 1,
    border: '1px solid #ddd',
    rounded: 1,
    outline: 'none',
    bg: 'white',
    fg: 'black',
    // elevation: 1,
  },
  '&Input:hover': {
    borderColor: '#777',
  },

  // Régle la couleur de l'autocompletion
  '&Input:autofill': {
    '-webkit-text-fill-color': 'black',
    '-webkit-box-shadow': '0 0 0 1000px white inset',
    'caret-color': 'black',
  },

  '& select': {
    // width: '100',
    // padding: '8px 12px',
    // fontSize: '16px',
    // border: '1px solid',
    // borderRadius: '4px',
    // cursor: 'pointer',
    // transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  '& select:focus': {
    // outline: 'none',
    // borderColor: '#4a90e2',
    // boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
  },
  '& option': {
    // padding: 8,
  },

  '&-switch &Input': {
    ...flexCenter(),
    w: 2,
    h: 1.5,
    cursor: 'pointer',
    border: '1px solid #ccc',
    bg: '#ddd',
    position: 'relative',
    borderRadius: '999px',
    transition: 0.3,
  },
  '&-switch &Input-selected': { border: 'primary', bg: 'primary' },

  '&-switch &InputHandle': {
    w: 1.2,
    h: 1.2,
    bg: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    elevation: 1,
    transition: 0.3,
    translateX: '-1em',
  },
  '&-switch &Input-selected &InputHandle': { translateX: '1em' },
};

export type FieldComp<T = any> = (props: {
  cls?: string;
  name: string | undefined;
  required?: boolean;
  value: T;
  onChange: (e: any) => void;
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
  | 'image'
  | 'doc'
  | 'date'
  | 'datetime'
  | 'time';

export interface FieldInfo<T = any> {
  row?: boolean;
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

export const castByType: Record<string, (next: any) => any> = {
  number: (next: any) => {
    const casted = toNbr(next, null);
    if (casted === null) throw toErr('not-a-number');
    return casted;
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
        class={cls}
        name={name}
        required={required}
        value={value || ''}
        onChange={onChange}
        {...fieldProps.props}
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
      class={cls}
      type="email"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
    />
  ),
  password: ({ cls, name, required, value, onChange, fieldProps }) => {
    const [show, setShow] = useState(false);
    return (
      <>
        <input
          class={cls}
          type={show ? 'text' : 'password'}
          name={name}
          required={required}
          value={value || ''}
          onChange={onChange}
          {...fieldProps.props}
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
      class={cls}
      type="color"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
    />
  ),
  text: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      class={cls}
      type="text"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
    />
  ),
  number: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      class={cls}
      type="number"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
    />
  ),
  multiline: ({ cls, name, required, value, onChange, fieldProps }) => (
    <textarea
      class={cls}
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      rows={5}
      {...fieldProps.props}
    />
  ),
  html: ({ cls, name, required, value, onChange, fieldProps }) => (
    <textarea
      class={cls}
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      rows={5}
      {...fieldProps.props}
    />
  ),
  // select: ({ cls, name, required, value, onChange, fieldProps }) => (
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
      <Div
        cls={[`${cls}`, value && `${cls}-selected`]}
        onClick={() => onChange(!value)}
        {...fieldProps.props}
      >
        <Div cls={`${cls}Handle`}></Div>
      </Div>
    );
  },
  image: getMediaField(['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']),
  doc: getMediaField(['application/pdf']),
  date: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      class={cls}
      type="date"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
    />
  ),
  datetime: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      class={cls}
      type="date"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
    />
  ),
  time: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      class={cls}
      type="time"
      step="1"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
    />
  ),
};

export const Field = (props: FieldProps) => {
  const {
    cls,
    row,
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
  const c = useCss('Field', css);

  const valDelay = delay || type === 'switch' ? 0 : delay;

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

          if (castType && castType in castByType) casted = castByType[castType](casted);
          else if (cast) casted = cast(casted);
          else if (type && type in castByType) casted = castByType[type](casted);

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

  const Comp = compByType[type || 'text'] || compByType.text;

  return (
    <Div
      {...divProps}
      cls={[c, row && `${c}-row`, type && `${c}-${type}`, err && `${c}-error`, cls]}
    >
      {label && <Div cls={`${c}Label`}>{label} :</Div>}
      <Div cls={`${c}Content`}>
        <Comp
          cls={`${c}Input`}
          name={name}
          value={changed === undefined ? initiated : changed}
          onChange={handleChange}
          required={required}
          fieldProps={props}
        />
        {err ? (
          <Div cls={`${c}Error`}>
            <Tr>{err}</Tr>
          </Div>
        ) : helper ? (
          <Div cls={`${c}Helper`}>{helper}</Div>
        ) : null}
      </Div>
    </Div>
  );
};

// //     type?: 'text'|'textarea'|'select';
// //     name: string;
// //     label?: string|ReactNode;
// //     value?: any;
// //     required?: boolean;
// //     values?: Record<string, string|ReactNode>;
// //     onChange: (e: any, next: any) => void,
// //     error?: string,
// //     helperText?: string,
// //     className?: string,
// //     children?: ReactNode,

// export type SelectItems = Record<string, ReactNode>|[string, ReactNode][]

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
