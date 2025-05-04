import { Css } from "../helpers/html";
import useCss from "../hooks/useCss";
import { flexColumn } from "../helpers/flexBox";
import Div, { DivProps } from "./Div";

const css: Css = {
    '&': {
        ...flexColumn({ align: 'stretch' })
    },
}

interface FormProps extends DivProps {}

export const Form = ({ cls, children, ...props }: FormProps) => {
    const c = useCss('Form', css);

    return (
        <Div cls={[c, cls]} {...props}>
            {children}
        </Div>
    );
};

export default Form;