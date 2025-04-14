// import { Css } from "../helpers/html";
// import Msg from "../helpers/Msg";
// import useCss from "../hooks/useCss";
// import useMsg from "../hooks/useMsg";
// import { ReactNode } from "react";
// import usePromise from "../hooks/usePromise";
// import { IconButton } from "./Button";
// import { FcSynchronize } from "react-icons/fc";
// import { flexRow } from "../helpers/flexBox";
// import Div, { DivProps } from "./Div";

// const css: Css = {
//     '&': {
//         ...flexRow({ align: 'center' }),
//     },
//     '& select': {
//         width: '100',
//         padding: '8px 12px',
//         fontSize: '16px',
//         border: '1px solid',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         transition: 'border-color 0.3s, box-shadow 0.3s',
//     },
//     '& select:focus': {
//         outline: 'none',
//         borderColor: '#4a90e2',
//         boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
//     },
//     '& option': {
//         padding: 8,
//     },
// }

// export interface SelectProps extends DivProps {
//     getItems: () => Promise<Record<string, ReactNode>>,
//     selectedId$: Msg<string>,
//     addContent?: ReactNode,
//     emptyContent?: ReactNode,
//     onAdd?: () => any|Promise<any>,
// }

// const Select = ({ cls, getItems, selectedId$, emptyContent, addContent, onAdd }: SelectProps) => {
//     const c = useCss('Select', css);
//     const [items, error, isLoading, refresh] = usePromise(getItems, []);
//     const selectedId = useMsg(selectedId$);

//     return (
//         <Div className={className ? `${cls} ${className}` : cls}>
//             {isLoading ? (
//                 "Chargement..."
//             ) : error ? (
//                 <span>{error}</span>
//             ) : (
//                 <select
//                     onChange={async (e) => {
//                         const value = e.target.value;
//                         if (value === '+') {
//                             await (onAdd && onAdd());
//                             refresh();
//                             return;
//                         }
//                         selectedId$?.set(e.target.value);
//                     }} 
//                     value={selectedId || ''}
//                 >
//                     <option value="">{emptyContent || '-----'}</option>
//                     {addContent && (
//                         <option value="+" className={`${cls}Add`}>{addContent}</option>
//                     )}
//                     {Object.entries(items||{}).map(([id, content]) => (
//                         <option key={id} value={id} className={id === selectedId ? `${cls}Selected` : undefined}>
//                             {content}
//                         </option>
//                     ))}
//                 </select>
//             )}
//             <IconButton onClick={refresh}>
//                 <FcSynchronize />
//             </IconButton>
//         </Div>
//     );
// };

// export default Select;