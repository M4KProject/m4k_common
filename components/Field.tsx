import { Css } from "../helpers/html";
import useCss from "../hooks/useCss";
import React, { ReactNode, useEffect, useState } from "react";
import { flexCenter, flexColumn, flexRow } from "../helpers/flexBox";
import { toNbr } from "../helpers/cast";
import Div, { DivProps } from "./Div";
import Tr from "./Tr";
import { toErr } from "../helpers/err";

const css: Css = {
    '&': {
        ...flexColumn({ align: 'stretch' }),
        w: '100%',
        m: 0.2,
    },
    '&-row': {
        ...flexRow({ align: 'start' })
    },
    '&Label': {
        flex: 1,
        textAlign: 'left',
    },
    '&Content': {
        ...flexRow({ align: 'center', justify: 'start' }),
        flex: 2,
        hMin: 2,
    },
    '&Input': {
        w: '100%',
        h: '100%',
        px: 0.8,
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
        transition: 'all 0.3s ease',
    },
    '&-switch &Input-selected': { border: 'primary', bg: 'primary' },

    '&-switch &InputHandle': {
        w: 1.2,
        h: 1.2,
        bg: '#fff',
        borderRadius: '50%',
        position: 'absolute',
        elevation: 1,
        transition: 'transform 0.3s ease',
        transform: 'translateX(-1em)',
    },
    '&-switch &Input-selected &InputHandle': { transform: 'translateX(1em)' },
}

export type FieldComp<T = any> = (props: {
    cls?: string,
    name: string | undefined,
    required?: boolean,
    value: T,
    onChange: (e: any) => void,
    fieldProps: FieldProps<T>,
}) => ReactNode;

export interface FieldProps<T = any> extends DivProps {
    row?: boolean,
    type?: string,
    name?: string;
    label?: ReactNode,
    helper?: ReactNode,
    value?: T,
    cast?: (next: T) => T,
    readonly?: boolean,
    required?: boolean,
    onValue?: (next: T) => void,
    delay?: number,
    items?: [string, ReactNode][],
}

const compByType: Record<string, FieldComp> = {
    color: ({ cls, name, required, value, onChange }) => (
        <input className={cls} type="color" name={name} required={required} value={value} onChange={onChange} />
    ),
    input: ({ cls, name, required, value, onChange }) => (
        <input className={cls} type="text" name={name} required={required} value={value} onChange={onChange} />
    ),
    number: ({ cls, name, required, value, onChange }) => (
        <input className={cls} type="number" name={name} required={required} value={value} onChange={onChange} />
    ),
    text: ({ cls, name, required, value, onChange }) => (
        <textarea className={cls} name={name} required={required} value={value} onChange={onChange} rows={5} />
    ),
    html: ({ cls, name, required, value, onChange }) => (
        <textarea className={cls} name={name} required={required} value={value} onChange={onChange} rows={5} />
    ),
    select: ({ cls, name, required, value, onChange, fieldProps }) => (
        <select className={cls} name={name} required={required} value={value} onChange={onChange}>
            {/* <option value=""></option> */}
            {fieldProps.items?.map(([id, content]) => (
                <option key={id} value={id} className={id === value ? `${cls}Selected` : undefined}>
                    {content}
                </option>
            ))}
        </select>
    ),
    switch: ({ cls, value, onChange }) => {
        return (
            <Div cls={[`${cls}`, value && `${cls}-selected`]} onClick={() => onChange(!value)}>
                <Div cls={`${cls}Handle`}></Div>
            </Div>
        )
    }
};

const Field = (props: FieldProps) => {
    const { cls, row, type, name, label, helper, readonly, required, value, cast, onValue, delay, items, ...divProps } = props;
    const c = useCss('Field', css);
    
    const [initiated, setInitiated] = useState<any>(value);
    const [changed, setChanged] = useState<any>(undefined);
    const [sended, setSended] = useState<any>(undefined);
    const [error, setError] = useState<any>(undefined);

    console.debug('Field', name, { value, initiated, changed, sended, error });

    const reset = () => {
        setInitiated(value);
        setChanged(undefined);
        setSended(undefined);
        setError(undefined);
    }

    useEffect(reset, [type, name]);

    // if sync value change -> reset
    useEffect(() => {
        console.debug('Field value', name, value);
        if (sended !== undefined) {
            if (sended === value) return;
        }
        else {
            if (initiated === value) return;
        }
        console.debug('Field value changed', name, initiated, '->', value);
        reset();
    }, [value]);

    // if next value change -> error or send
    useEffect(() => {
        console.debug('Field changed', name, changed);
        setError(undefined);
        if (changed === undefined) return;
        if (changed === sended) return;
        const timer = setTimeout(() => {
            try {
                let casted = changed;
                if (type === 'number') {
                    casted = toNbr(casted, null);
                    if (casted === null) throw toErr('not-a-number');
                }
                if (cast) casted = cast(casted);
                if (casted === sended) return;
                console.debug('Field sync', name, sended, '->', casted);
                setSended(casted);
                if (onValue) onValue(casted);
            }
            catch (error) {
                setError(error);
            }
        }, delay === undefined ? 100 : delay);
        return () => clearTimeout(timer);
    }, [changed]);

    const handleChange = (e: any) => {
        console.debug('Field handleChange', e);
        if (readonly) return;
        let next = typeof e === 'object' && e.target ? e.target.value : e;
        console.debug('Field next', name, changed, '->', next);
        setChanged(next);
    }

    const Comp = compByType[type as any] || compByType.input;
    
    return (
        <Div {...divProps} cls={[c, row && `${c}-row`, type && `${c}-${type}`, error && `${c}-error`, cls]}>
            {label && (<Div cls={`${c}Label`}>{label} :</Div>)}
            <Div cls={`${c}Content`}>
                <Comp cls={`${c}Input`} name={name} value={changed === undefined ? initiated : changed} onChange={handleChange} required={required} fieldProps={props} />
                {error ? (
                    <Div cls={`${c}Error`}>
                        <Tr>{error}</Tr>
                    </Div>
                ) : helper ? (
                    <Div cls={`${c}Helper`}>{helper}</Div>
                ) : null}
            </Div>
        </Div>
    );
};

export default Field;

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