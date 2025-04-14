// import useFormState, { FormOptions, FormState, FormField } from '../hooks/useFormState';
// import { ReactNode, useEffect } from 'react';
// import { flexColumn, flexRow } from '../helpers/flexBox';
// import Button, { ButtonProps } from './Button';
// import { HTMLFormProps } from './types';
// import { setCss } from '../helpers/html';

// export interface FormActionData {
//     type: 'submit'|'reset'|'button',
//     content: string,
//     props?: ButtonProps,
// }

// export interface FormProps<T extends {}> extends HTMLFormProps {
//     options?: FormOptions<T>,
//     state?: FormState<T>,
//     title?: string,
//     actions?: (ReactNode|FormActionData)[]
// }

// export const FormAction = (props: ButtonProps) => {
//     const color = props.type === "submit" ? "primary" : "secondary";
//     return <Button color={color} {...props} />;
// }

// const css: Css = {
//     '&': {
//         ...flexColumn({ align: 'stretch' }),
//         minWidth: "25em",
//     },
//     '&_title': {
//         textAlign: 'center',
//         fontSize: 1.5,
//         fontWeight: 700,
//         color: '#7d7d7d',
//         margin: "0.5em",
//     },
//     '&_actions': {
//         ...flexRow({ align: 'stretch' }),
//     },
//     '&_action': {
//         ...flexColumn({ flex: 1, align: 'stretch' }),
//         m: 0.5,
//     },
// };

// const defaultActions: FormProps<any>['actions'] = [
//     { type: 'reset', content: 'Annuler' },
//     { type: 'submit', content: 'Valider' },
// ];

// /* <Slider defaultValue={30} step={10} marks min={10} max={110} disabled /> */

// export interface Field {

// }

// const Form = <T extends {} = any>({ options, state, title, actions, ...props }: FormProps<T>) => {
//     const cls = useCss('Form', css);
//     // const privateState = useFormState(options || ({ init: {}, fields: {} }) as FormOptions<T>, [])
//     // const s = state || privateState

//     return (
//         <form
//             className="Form"
//             onReset={s.handleReset}
//             onSubmit={s.handleSubmit}
//             {...props}
//         >
//             {title && (
//                 <h3 className="Form_title">
//                     {title}
//                 </h3>
//             )}
//             {Object.entries(s.options.fields).map(([name, field]) => {
//                 const { component, ...props } = field as FormField
//                 const Comp: React.FunctionComponent<any> = component || Field
//                 return <Comp
//                     key={name}
//                     {...s.props(name as keyof T)}
//                     {...props}
//                 />;
//             })}
//             <div className="Form_actions">
//                 {(actions||defaultActions).map((action, i) => {
//                     const data = action as FormActionData;
//                     return (
//                         <div className="Form_action" key={i}>
//                             {data.content ? (
//                                 data.type === "submit" ? (
//                                     <Button type="submit" color="secondary" onClick={s.handleSubmit} {...data.props}>
//                                         {data.props?.children || data.content}
//                                     </Button>
//                                 ) : data.type === "reset" ? (
//                                     <Button type="reset" color="error" onClick={s.handleReset} {...data.props}>
//                                         {data.props?.children || data.content}
//                                     </Button>
//                                 ) : (
//                                     <Button color="secondary" {...data.props}>
//                                         {data.props?.children || data.content}
//                                     </Button>
//                                 )
//                             ) : action as ReactNode}
//                         </div>
//                     )
//                 })}
//             </div>
//         </form>
//     )
// }

// export default Form;




// // import { setCss } from "@/helpers/html";
// // import { cBg, cBorder, cError, cPrimary, cPrimaryBg, cPrimaryText } from "./theme";
// // import { flexRow } from "@/helpers/flexBox";
// // import { ReactNode } from "react";
// // import cls from "@/helpers/cls";
// // import Button from "./Button";

// // setCss('m4kField', {
// //     '&': {
// //         ...flexRow({ align: 'center', justify: 'around', wrap: 'wrap' }),
// //         m: .5,
// //         rounded: 1,
// //     },
// //     '&:hover': {
// //         borderColor: cPrimary,
// //     },
// //     '&:hover &': {
// //         borderColor: cPrimary,
// //     },
// //     '&:focus': {
// //         borderColor: cPrimary,
// //         elevation: 2,
// //     },
// //     '&:focus-visible': {
// //         outline: 0
// //     },
// //     '&Label': {
// //         width: '12em'
// //     },
// //     '&Input': {
// //         flex: 1,
// //         fontSize: 1.1,
// //         fontWeight: "bold",
// //         p: 0.3,
// //         border: `1px solid ${cBorder}`,
// //         rounded: 1.5,
// //         transition: 'all 0.5s ease',
// //         bg: cPrimaryText,
// //         color: cBg,
// //     },
// //     '&Input:focus, &Input:hover': {
// //         bg: cPrimaryText,
// //         color: cBg,
// //         border: `1px solid ${cBorder}`,
// //         elevation: 1,
// //         outline: 'none',
// //     },
// //     '&Select': {
// //         ...flexRow({ align: 'center', wrap: 'wrap', justify: 'around' }),
// //     },
// //     '&Error': {
// //         width: '100%',
// //         color: cError
// //     }
// // });

// // export interface FieldProps {
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
// // }

// // const Field = ({ type, name, label, value, error, required, values, children, onChange, className }: FieldProps) => {
// //     // const children = props.children = Object.entries(field.options).map(([key, label]) => (
// //     //     <MenuItem key={key} value={key}>{label}</MenuItem>
// //     // ));

// //     let input = null;

// //     switch (type) {
// //         case 'select':
// //             input = (
// //                 <div id={name} className={cls("m4kFieldInput", "m4kFieldSelect")}>
// //                     {values ? Object.keys(values).map(k => (
// //                         <Button
// //                             key={k}
// //                             color={value === k ? 'primary' : 'default'}
// //                             onClick={e => onChange(e, k)}
// //                         >
// //                             {(values as any)[k]}
// //                         </Button>
// //                     )) : children}
// //                 </div>
// //             );
// //             break;
// //         case 'textarea':
// //             input = (
// //                 <textarea
// //                     className="m4kFieldInput"
// //                     id={name}
// //                     name={name}
// //                     required={required}
// //                     value={value}
// //                     onChange={e => onChange(e, e.target.value)}
// //                     rows={5}
// //                 >
// //                     {values ? Object.keys(values).map(k => (
// //                         <option key={k} value={k}>
// //                             {(values as any)[k]}
// //                         </option>
// //                     )) : children}
// //                 </textarea>
// //             );
// //             break;
// //         default:
// //             input = (
// //                 <input
// //                     className="m4kFieldInput"
// //                     id={name}
// //                     name={name}
// //                     type={type}
// //                     required={required}
// //                     value={value}
// //                     onChange={e => onChange(e, e.target.value)}
// //                 />
// //             )
// //             break;
// //     }

// //     return (
// //         <div className={cls("m4kField", className)}>
// //             {label && (
// //                 <label
// //                     className="m4kFieldLabel"
// //                     htmlFor={name}
// //                 >
// //                     {label}
// //                 </label>
// //             )}
// //             {input}
// //             {error && <div className="m4kFieldError">{error}</div>}
// //         </div>
// //     )
// // }


// // // switch (field.type) {
// // //     case 'select':
// // //         props.select = true;
// // //         if (typeof field.options === 'object') {
// // //             props.children = Object.entries(field.options).map(([key, label]) => (
// // //                 <MenuItem key={key} value={key}>{label}</MenuItem>
// // //             ));
// // //         }
// // //         break;
// // //     case 'textarea':
// // //         Comp = Textarea;
// // //         break;
// // //     case 'switch':
// // //         Comp = Switch;
// // //         break;
// // // }

// // export default Field;



// // import { FieldProps } from "./Field";
// // import { eventStop } from "../helpers/html";
// // import { Dispatch, SetStateAction, useMemo, useState, FunctionComponent } from "react";
// // import useCss from '../hooks/useCss';

// // export type FormErrors<T extends {} = any> = { [P in keyof T]?: string };

// // export type FormField<T = any> = {
// //     validate?: (value: T) => true|false|string,
// //     component?: FunctionComponent<any>,
// // } & Partial<FieldProps>;

// // export type FormOptions<T extends {}> = {
// //     init: T,
// //     fields: { [P in keyof T]: FormField<T[P]> },
// //     onUpdate?: (form: FormState<T>, changes: Partial<T>) => void|Promise<void>,
// //     onReset?: (form: FormState<T>) => void|Promise<void>,
// //     onSubmit?: (form: FormState<T>) => void|Promise<void>,
// // };

// // export class FormState<T extends {}> {
// //     options!: FormOptions<T>;

// //     values!: Readonly<T>;
// //     setValues!: Dispatch<SetStateAction<T>>;

// //     errors!: Readonly<FormErrors<T>>;
// //     setErrors!: Dispatch<SetStateAction<FormErrors<T>>>;

// //     refresh(options: FormOptions<T>) {
// //         this.options = options;
// //         const [values, setValues] = useState<T>(options.init);
// //         const [errors, setErrors] = useState<FormErrors<T>>({});
// //         this.values = values;
// //         this.setValues = setValues;
// //         this.errors = errors;
// //         this.setErrors = setErrors;
// //         return this;
// //     }

// //     update(changes: Partial<T>) {
// //         this.setValues(prev => ({ ...prev, ...changes }));

// //         const onUpdate = this.options.onUpdate
// //         if (onUpdate) onUpdate(this, changes)
// //     }

// //     setValue(name: keyof T, value: any) {
// //         this.validate(name, value);
// //         this.update({ [name]: value } as any);
// //     }

// //     setError(name: keyof T, error: string) {
// //         this.setErrors(prev => ({ ...prev, [name]: error }));
// //     }

// //     reset() {
// //         this.setValues(this.options.init);
// //         this.setErrors({});

// //         const onReset = this.options.onReset;
// //         if (onReset) onReset(this);
// //     }

// //     validate<P extends keyof T>(name: P, value: any) {
// //         const field = this.options.fields[name];
// //         if (!field) return false;
// //         if (value === null || value === "" || value === undefined) {
// //             if (field.required) {
// //                 this.setError(name, `Le champ « ${field.label} » est requis`);
// //                 return false;
// //             }
// //         }
// //         if (field.validate) {
// //             const result = field.validate(value);
// //             if (result !== true) {
// //                 this.setError(name, typeof result === "string" ? result : `Le champ « ${field.label} » n'est pas valide`);
// //                 return false;
// //             }
// //         }
// //         this.setError(name, '');
// //         return true;
// //     }

// //     handler(name: keyof T) {
// //         return (e: any, value: any) => {
// //             eventStop(e)
// //             this.setValue(name, value !== undefined ? value : e.target.value);
// //         }
// //     }

// //     hasErrors() {
// //         return !!Object.values(this.errors).find(e => e);
// //     }

// //     submit() {
// //         console.log('submit', this);
// //         const values = this.values;
// //         for (const prop in values) {
// //             const value = values[prop];
// //             this.validate(prop, value);
// //         }
// //         if (!this.hasErrors()) {
// //             const onSubmit = this.options.onSubmit;
// //             if (onSubmit) onSubmit(this);
// //         }
// //     }

// //     handleSubmit = (e: any) => {
// //         console.log('handleSubmit', e);
// //         eventStop(e)
// //         this.submit();
// //     }

// //     handleReset = (e: any) => {
// //         console.log('handleReset', e);
// //         eventStop(e)
// //         this.reset()
// //     }

// //     props(name: keyof T): FieldProps {
// //         const field = this.options.fields[name];
// //         const value = this.values[name];
// //         const error = this.errors[name];
// //         return {
// //             name: String(name),
// //             onChange: this.handler(name),
// //             value,
// //             error,
// //             ...field,
// //         }
// //     }
// // }

// // const useForm = <T extends {}>(options: FormOptions<T>, deps: React.DependencyList): FormState<T> => {
// //     return useMemo(() => new FormState<T>(), deps).refresh(options);
// // }

// // export default useForm;