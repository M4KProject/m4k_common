import { JSX } from "preact";
import { useTr } from "../hooks/useTr";

export interface TrProps extends JSX.HTMLAttributes<HTMLDivElement> {
    children?: any;
};

export const Tr = ({ children }: TrProps) => {
    const tr = useTr();
    return tr(children);
};
