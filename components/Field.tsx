// import { setCss } from "@/helpers/html";
// import { cBg, cBorder, cError, cPrimary, cPrimaryBg, cPrimaryText } from "./theme";
// import { flexRow } from "@/helpers/flexBox";
// import { ReactNode } from "react";
// import cls from "@/helpers/cls";
// import Button from "./Button";

// setCss('m4kField', {
//     '&': {
//         ...flexRow({ align: 'center', justify: 'around', wrap: 'wrap' }),
//         m: .5,
//         rounded: 1,
//     },
//     '&:hover': {
//         borderColor: cPrimary,
//     },
//     '&:hover &': {
//         borderColor: cPrimary,
//     },
//     '&:focus': {
//         borderColor: cPrimary,
//         elevation: 2,
//     },
//     '&:focus-visible': {
//         outline: 0
//     },
//     '&Label': {
//         width: '12em'
//     },
//     '&Input': {
//         flex: 1,
//         fontSize: 1.1,
//         fontWeight: "bold",
//         p: 0.3,
//         border: `1px solid ${cBorder}`,
//         rounded: 1.5,
//         transition: 'all 0.5s ease',
//         bg: cPrimaryText,
//         color: cBg,
//     },
//     '&Input:focus, &Input:hover': {
//         bg: cPrimaryText,
//         color: cBg,
//         border: `1px solid ${cBorder}`,
//         elevation: 1,
//         outline: 'none',
//     },
//     '&Select': {
//         ...flexRow({ align: 'center', wrap: 'wrap', justify: 'around' }),
//     },
//     '&Error': {
//         width: '100%',
//         color: cError
//     }
// });

// export interface FieldProps {
//     type?: 'text'|'textarea'|'select';
//     name: string;
//     label?: string|ReactNode;
//     value?: any;
//     required?: boolean;
//     values?: Record<string, string|ReactNode>;
//     onChange: (e: any, next: any) => void,
//     error?: string,
//     helperText?: string,
//     className?: string,
//     children?: ReactNode,
// }

// const Field = ({ type, name, label, value, error, required, values, children, onChange, className }: FieldProps) => {
//     // const children = props.children = Object.entries(field.options).map(([key, label]) => (
//     //     <MenuItem key={key} value={key}>{label}</MenuItem>
//     // ));

//     let input = null;

//     switch (type) {
//         case 'select':
//             input = (
//                 <div id={name} className={cls("m4kFieldInput", "m4kFieldSelect")}>
//                     {values ? Object.keys(values).map(k => (
//                         <Button
//                             key={k}
//                             color={value === k ? 'primary' : 'default'}
//                             onClick={e => onChange(e, k)}
//                         >
//                             {(values as any)[k]}
//                         </Button>
//                     )) : children}
//                 </div>
//             );
//             break;
//         case 'textarea':
//             input = (
//                 <textarea
//                     className="m4kFieldInput"
//                     id={name}
//                     name={name}
//                     required={required}
//                     value={value}
//                     onChange={e => onChange(e, e.target.value)}
//                     rows={5}
//                 >
//                     {values ? Object.keys(values).map(k => (
//                         <option key={k} value={k}>
//                             {(values as any)[k]}
//                         </option>
//                     )) : children}
//                 </textarea>
//             );
//             break;
//         default:
//             input = (
//                 <input
//                     className="m4kFieldInput"
//                     id={name}
//                     name={name}
//                     type={type}
//                     required={required}
//                     value={value}
//                     onChange={e => onChange(e, e.target.value)}
//                 />
//             )
//             break;
//     }

//     return (
//         <div className={cls("m4kField", className)}>
//             {label && (
//                 <label
//                     className="m4kFieldLabel"
//                     htmlFor={name}
//                 >
//                     {label}
//                 </label>
//             )}
//             {input}
//             {error && <div className="m4kFieldError">{error}</div>}
//         </div>
//     )
// }


// // switch (field.type) {
// //     case 'select':
// //         props.select = true;
// //         if (typeof field.options === 'object') {
// //             props.children = Object.entries(field.options).map(([key, label]) => (
// //                 <MenuItem key={key} value={key}>{label}</MenuItem>
// //             ));
// //         }
// //         break;
// //     case 'textarea':
// //         Comp = Textarea;
// //         break;
// //     case 'switch':
// //         Comp = Switch;
// //         break;
// // }

// export default Field;