import { HTMLAttributes } from "react";
import { clsx } from "../helpers/html";
import React from "react";

export interface DivProps extends HTMLAttributes<HTMLDivElement> {
    cls?: any,
};

const Div = ({ cls, className, ...props }: DivProps) => (
    <div {...props} className={clsx(cls, className)} />
);

export default Div