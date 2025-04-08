import { flexCenter, flexColumn } from "../helpers/flexBox";
import useMsg from "../hooks/useMsg";
import { dialog$ } from "../messages/dialog$";
import { Css } from "../helpers/html";
import useCss from "../hooks/useCss";
import { tCls } from "../messages/theme$";

const css: Css = {
    '&': {
        position: 'fixed',
        inset: 0,
        bg: '#000000AA',
        ...flexCenter(),
    },
    '&Window': {
        ...flexColumn(),
        elevation: 3,
        rounded: 2,
        maxWidth: '80%',
        minWidth: '80%',
        overflow: 'hidden',
    },
    '&Header': {
        ...flexCenter(),
        textAlign: 'center',
        fontSize: 1.4,
        fontWeight: "bold",
        m: 0,
        p: 1,
        py: 0.2,
    },
    '&Content': {
        ...flexColumn(),
        m: 1,
    },
}

const Dialog = () => {
    const dialogClass = useCss('Dialog', css)
    const dialog = useMsg(dialog$)
    console.debug("Dialog", dialog);

    if (!dialog) return null;

    const { onClose, title, content } = dialog
    const Content = content
    
    return (
        <div className={dialogClass} onClick={onClose}>
            <div className={`${dialogClass}Window ${tCls('base')}`} onClick={e => e.stopPropagation()}>
                {title && <h1 className={`${dialogClass}Header ${tCls('primary')}`}>{title}</h1>}
                <div className={`${dialogClass}Content`}>
                    <Content />
                </div>
            </div>
        </div>
    );
};

export default Dialog