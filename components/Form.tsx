import { Css } from "../helpers/html";
import { useCss } from "../hooks/useCss";
import { flexColumn } from "../helpers/flexBox";
import { Div, DivProps } from "./Div";

const css: Css = {
    '&': {
        ...flexColumn({ align: 'stretch' }),
        m: 0.5,
        p: 1,
        elevation: 1,
        border: '1px solid #eee',
        bg: 'white',
        rounded: 1,
    },
    '&Title': {
        ...flexColumn({ align: 'start', justify: 'end' }),
        py: 0.5,
        color: '#0a536f',
        fontWeight: 'bold',
        // borderBottom: '1px solid #0a536f',
    },
}

interface FormProps extends DivProps {}
export const Form = ({ cls, children, title, ...props }: FormProps) => {
    const c = useCss('Form', css);
    return (
        <Div cls={[c, cls]} {...props}>
            {title && <Div cls={`${c}Title`}>{title}</Div>}
            {children}
        </Div>
    );
};