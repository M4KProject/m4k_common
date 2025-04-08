import cls from "@common/helpers/cls";
import { Css } from "@common/helpers/html";
import Msg from "@common/helpers/Msg";
import useCss from "@common/hooks/useCss";
import useMsg from "@common/hooks/useMsg";
import { ReactNode } from "react";
import { tCls } from "../messages/theme$";

const css: Css = {
    '& select': {
        width: '100',
        padding: '8px 12px',
        fontSize: '16px',
        border: '1px solid',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    '& select:focus': {
        outline: 'none',
        borderColor: '#4a90e2',
        boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
    },
    '& option': {
        padding: 8,
    },
}

export interface SelectProps {
    className?: string,
    items?: (({ id: string, content: ReactNode }|undefined|null)[])|null,
    selectedId$?: Msg<string>,
    addContent?: ReactNode,
    emptyContent?: ReactNode,
}

const Select = ({ className, items, selectedId$, emptyContent, addContent }: SelectProps) => {
    const selectClassName = useCss('Select', css);
    const selectedId = useMsg(selectedId$);

    return (
        <div className={cls(selectClassName, className)}>
            <select
                onChange={e => selectedId$?.set(e.target.value)} 
                value={selectedId || ''}
            >
                <option value="">{emptyContent || '-----'}</option>
                {addContent && (
                    <option value="+" className={tCls('add')}>{addContent}</option>
                )}
                {(items||[]).map(item => item ? (
                    <option key={item.id} value={item.id} className={item.id === selectedId ? tCls('selected') : undefined}>
                        {item.content}
                    </option>
                ) : null)}
            </select>
        </div>
    );
};

export default Select;