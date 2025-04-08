// import useFormState, { FormOptions, FormState, FormField } from '@/hooks/useFormState';
// import { ReactNode, useEffect } from 'react';
// import { flexColumn, flexRow } from '@/helpers/flexBox';
// import Button, { ButtonProps } from './Button';
// import { HTMLFormProps } from './types';
// import { setCss } from '@/helpers/html';
// import Field from './Field';

// interface FormActionData {
//     type: 'submit'|'reset'|'button',
//     content: string,
//     props?: ButtonProps,
// }

// interface FormProps<T extends {}> extends HTMLFormProps {
//     options?: FormOptions<T>,
//     state?: FormState<T>,
//     title?: string,
//     actions?: (ReactNode|FormActionData)[]
// }

// export const FormAction = (props: ButtonProps) => {
//     const color = props.type === "submit" ? "primary" : "secondary";
//     return <Button color={color} {...props} />;
// }

// setCss('Form', {
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
// });

// const defaultActions: FormProps<any>['actions'] = [
//     { type: 'reset', content: 'Annuler' },
//     { type: 'submit', content: 'Valider' },
// ];

// /* <Slider defaultValue={30} step={10} marks min={10} max={110} disabled /> */

// export interface Field {

// }

// const Form = <T extends {} = any>({ options, state, title, actions, ...props }: FormProps<T>) => {
//     const privateState = useFormState(options || ({ init: {}, fields: {} }) as FormOptions<T>, [])
//     const s = state || privateState

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