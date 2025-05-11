import { Css } from "../helpers/html";
import { Div, DivProps } from "./Div";
import { useCss } from "../hooks/useCss";
import { clamp, round } from "../helpers/nbr";
import { toNbr } from "@common/helpers";
import { flexCenter } from "@common/helpers";

const css: Css = {
    '&': {
        ...flexCenter(),
        position: 'relative',
        bg: 'white',
        border: 'primary',
        borderRadius: '0.2em',
    },
    '&Bar': {
        position: 'absolute',
        top: 0,
        left: 0,
        h: '100%',
        w: 0,
        bg: 'primary',
        borderRadius: '0.2em 0 0 0.2em',
        transition: 'width 0.5s ease',
    },
    '&Text': {
        fg: 'black',
        zIndex: 1,
    }
}

export const Progress = ({ progress, cls, children, ...props }: DivProps & { progress?: number|null }) => {
    const c = useCss('Progress', css);
    const prct = clamp(round(toNbr(progress, 0)), 0, 100);
    return (
        <Div {...props} cls={[c, cls]}>
            <Div cls={`${c}Bar`} style={{ width: prct + '%' }} />
            <Div cls={`${c}Text`}>{prct}%</Div>
            {children}
        </Div>
    );
}
