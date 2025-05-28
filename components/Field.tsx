import { Css } from "../helpers/html";
import { useCss } from "../hooks/useCss";
import { ReactNode, useEffect, useState } from "react";
import { flexCenter, flexColumn, flexRow } from "../helpers/flexBox";
import { toNbr } from "../helpers/cast";
import { Div, DivProps } from "./Div";
import { Tr } from "./Tr";
import { toErr } from "../helpers/err";
// import { useMsg } from "../hooks/useMsg";
// import { groupId$ } from "../api/repos";
// import { medias$ } from "../api/storage";
// import { by } from "../helpers/by";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from "./Button";

const css: Css = {
    '&': {
        ...flexColumn({ align: 'stretch' }),
        w: '100%',
        // m: 0.5,
    },
    '&-row': {
        ...flexRow({ align: 'start' })
    },
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
        h: '100%',
        py: 0.2,
        px: 1,
        border: '1px solid #ddd',
        rounded: 1,
        outline: 'none',
    },
    '&Input:hover': {
        borderColor: '#777',
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

export type FieldType = 'email'|'password'|'text'|'multiline'|'html'|'color'|'number'|'select'|'switch'|'image'|'doc';

export interface FieldInfo {
    row?: boolean;
    type?: FieldType;
    name?: string;
    label?: ReactNode;
    helper?: ReactNode;
    items?: [string, ReactNode][];
    required?: boolean;
    readonly?: boolean;
    castType?: string;
    props?: any;
}

export interface FieldProps<T = any> extends FieldInfo, DivProps {
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
    }
}

const getMediaField = (_mimetypes: string[]): FieldComp => {
    // const mimetypeMap = by(mimetypes, m => m, () => true);
    return ({ cls, name, required, value, onChange, fieldProps }) => {
        // const medias = Object.values(useMsg(medias$));
        // const filteredMedias = medias.filter(m => mimetypeMap[m.mimetype]);
        // const groupId = useMsg(groupId$);
        return (
            <select className={cls} name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props}>
                {/* <option value="" className={!value ? `${cls}Selected` : undefined}></option>
                {Object.values(filteredMedias).map(media => (
                    <option key={media.id} value={media.id} className={media.id === value ? `${cls}Selected` : undefined}>
                        {media.name.replace(`${groupId}/`, '')}
                    </option>
                ))} */}
            </select>
        );
    }
}

const compByType: Record<FieldType, FieldComp> = {
    email: ({ cls, name, required, value, onChange, fieldProps }) => (
        <input className={cls} type="email" name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props} />
    ),
    password: ({ cls, name, required, value, onChange, fieldProps }) => {
        const [show, setShow] = useState(false);
        return (
            <>
                <input className={cls} type={show ? 'text' : 'password'} name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props} />
                <Button onClick={() => setShow(s => !s)} icon={show ? <IoMdEyeOff /> : <IoMdEye />} />
            </>
        )
    },
    color: ({ cls, name, required, value, onChange, fieldProps }) => (
        <input className={cls} type="color" name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props} />
    ),
    text: ({ cls, name, required, value, onChange, fieldProps }) => (
        <input className={cls} type="text" name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props} />
    ),
    number: ({ cls, name, required, value, onChange, fieldProps }) => (
        <input className={cls} type="number" name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props} />
    ),
    multiline: ({ cls, name, required, value, onChange, fieldProps }) => (
        <textarea className={cls} name={name} required={required} value={value||''} onChange={onChange} rows={5} {...fieldProps.props} />
    ),
    html: ({ cls, name, required, value, onChange, fieldProps }) => (
        <textarea className={cls} name={name} required={required} value={value||''} onChange={onChange} rows={5} {...fieldProps.props} />
    ),
    select: ({ cls, name, required, value, onChange, fieldProps }) => (
        <select className={cls} name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props}>
            {/* <option value=""></option> */}
            {fieldProps.items?.map(([id, content]) => (
                <option key={id} value={id} className={id === value ? `${cls}Selected` : undefined}>
                    {content}
                </option>
            ))}
        </select>
    ),
    switch: ({ cls, value, onChange, fieldProps }) => {
        return (
            <Div cls={[`${cls}`, value && `${cls}-selected`]} onClick={() => onChange(!value)} {...fieldProps.props}>
                <Div cls={`${cls}Handle`}></Div>
            </Div>
        )
    },
    image: getMediaField(['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']),
    doc: getMediaField(['application/pdf']), 
};

export const Field = (props: FieldProps) => {
    const { cls, row, type, name, label, helper, readonly, required, value, cast, castType, onValue, delay, items, ...divProps } = props;
    const c = useCss('Field', css);
    
    const [initiated, setInitiated] = useState<any>(value);
    const [changed, setChanged] = useState<any>(undefined);
    const [sended, setSended] = useState<any>(undefined);
    const [error, setError] = useState<any>(undefined);

    // console.debug('Field', name, { value, initiated, changed, sended, error });

    const reset = () => {
        setInitiated(value);
        setChanged(undefined);
        setSended(undefined);
        setError(undefined);
    }

    useEffect(reset, [type, name]);

    // if sync value change -> reset
    useEffect(() => {
        // console.debug('Field value', name, value);
        if (sended !== undefined) {
            if (sended === value) return;
        }
        else {
            if (initiated === value) return;
        }
        // console.debug('Field value changed', name, initiated, '->', value);
        reset();
    }, [value]);

    // if next value change -> error or send
    useEffect(() => {
        // console.debug('Field changed', name, changed);
        setError(undefined);
        if (changed === undefined) return;
        if (changed === sended) return;
        const timer = setTimeout(() => {
            try {
                let casted = changed;

                if (castType && castType in castByType)
                    casted = castByType[castType](casted);
                else if (cast)
                    casted = cast(casted);
                else if (type && type in castByType)
                    casted = castByType[type](casted);

                if (casted === sended) return;
                console.debug('Field sync', name, sended, '->', casted);
                setSended(casted);
                if (onValue) onValue(casted);
            }
            catch (error) {
                setError(error);
            }
        }, delay === undefined ? 500 : delay);
        return () => clearTimeout(timer);
    }, [changed]);

    const handleChange = (e: any) => {
        console.debug('Field handleChange', e);
        if (readonly) return;
        let next = typeof e === 'object' && e.target ? e.target.value : e;
        console.debug('Field next', name, changed, '->', next);
        setChanged(next);
    }

    const Comp = compByType[type||'text'] || compByType.text;
    
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