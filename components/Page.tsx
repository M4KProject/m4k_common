import React from "react";
import { flexColumn, flexRow } from "../helpers/flexBox";
import { Css } from "../helpers/html";
import useCss from "../hooks/useCss";
import Div, { DivProps } from "./Div";
import Tr from "./Tr";
import { ReactNode } from "react";

const css: Css = {
    '&': {
        ...flexColumn({ align: 'stretch', justify: 'start' }),
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    '&Header': {
        ...flexRow({ align: 'center', justify: 'around' }),
        bg: 'headerBg',
    },
    '&HeaderTitle': {
        ...flexRow({ align: 'center' }),
        fontSize: 2,
        fg: 'headerTitle',
    },
    '&HeaderContent': {
        ...flexRow({ align: 'center' }),
    },
    '&Body': {
        ...flexColumn({ align: 'stretch', justify: 'start' }),
        position: 'relative',
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
    },
}

export interface PageProps extends DivProps {};
const Page = ({ cls, children, ...props }: PageProps) => {
    const c = useCss('Page', css)
    return (
        <Div cls={[c, cls]} {...props}>
            {children}
        </Div>
    );
};

export interface PageHeaderProps extends Omit<DivProps, 'title'> {
    title: ReactNode,
};
export const PageHeader = ({ cls, title, children, ...props }: PageHeaderProps) => {
    const c = useCss('Page', css)
    return (
        <Div cls={[`${c}Header`, cls]} {...props}>
            <Div cls={`${c}HeaderTitle`}>
                <Tr>{title}</Tr>
            </Div>
            <Div cls={`${c}HeaderContent`}>
                {children}
            </Div>
        </Div>
    );
};

export interface PageBodyProps extends DivProps {};
export const PageBody = ({ cls, children, ...props }: PageBodyProps) => {
    const c = useCss('Page', css)
    return (
        <Div cls={[`${c}Body`, cls]} {...props}>
            {children}
        </Div>
    );
};

export default Page