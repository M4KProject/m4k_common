import { HTMLAttributes } from "react";
import { useTr } from "../hooks/useTr";

export interface TrProps extends HTMLAttributes<HTMLDivElement> {
    children?: any;
};

export const Tr = ({ children }: TrProps) => {
    const tr = useTr();
    return tr(children);
};
