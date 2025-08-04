import { useCss, useMsg } from '../hooks';
import { Css } from '../helpers/html';
import { Msg } from '../helpers/Msg';
import { flexColumn } from '../helpers/flexBox';
import { Div, DivProps } from './Div';
import { Button, ButtonProps } from './Button';
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { MdMenu } from 'react-icons/md';

const css: Css = {
    '&': {
        position: 'relative',
        transition: 0.2,
        elevation: 1,
        w: 3,
    },
    '&Mask': {
        position: 'absolute',
        x: 0,
        y: '50%',
        w: 3,
        h: '100%',
        zIndex: 100,
        overflow: 'hidden',
        translateY: '-50%',
        transition: 0.2,
    },
    '&Content': {
        ...flexColumn({ align: 'stretch' }),
        position: 'absolute',
        color: '#ffffff',
        fg: 'sideFg',
        xy: 0,
        wMinMax: 13,
        h: '100%',
        bg: '#f4f7fe',
    },
    '& .ButtonContent': {
        transition: 0.2,
        opacity: 0,
    },

    '&-open': {
        w: 13,
    },
    '&-open &Mask': {
        w: 13,
    },
    '&-open .ButtonContent': {
        opacity: 1,
    },

    '&Sep': {
        ...flexColumn({ align: 'start', justify: 'end' }),
        pl: 1,
        flex: 1,
        color: '#0a536f',
        fontWeight: 'bold',
        // borderBottom: '1px solid #0a536f',
    },

    '&-editor': { w: 0 },
    '&-editor &Mask': {
        w: 3,
        h: 18,
        bg: '#0090c87a',
        elevation: 1,
        borderRadius: '0 0.5em 0.5em 0',
    },
    '&-editor &Sep': { visibility: 'hidden' },
}

const SideContext = createContext<Msg<string>|null|undefined>(undefined);
const SideProvider = SideContext.Provider;

export interface SideButtonProps extends ButtonProps { page: string }
export const SideButton = ({ page, title, children, ...props }: SideButtonProps) => {
    const c = useCss('Side', css);
    const page$ = useContext(SideContext);
    const curr = useMsg(page$);
    return (
        <Button
            cls={`${c}Button`}
            selected={page === curr}
            onClick={() => page$?.set(page)}
            {...props}
        >
            {title}
            {children}
        </Button>
    )
}

export interface SideSepProps extends DivProps {}
export const SideSep = ({ cls, ...props }: SideSepProps) => {
    const c = useCss('Side', css);
    return <Div {...props} cls={[`${c}Sep`, cls]} />
}

export interface SideProps extends DivProps { page$?: Msg<string>|null }
export const Side = ({ cls, children, page$, ...props }: SideProps) => {
    const c = useCss('Side', css);
    const [open, setOpen] = useState(true);
    const toggleOpen = () => setOpen(open => !open);
    return (
        <SideProvider value={page$}>
            <Div {...props} cls={[c, open && `${c}-open`, cls]}>
                <Div cls={`${c}Mask`}>
                    <Div cls={`${c}Content`}>
                        <Button icon={<MdMenu />} onClick={toggleOpen}>Ouvrir</Button>
                        {children}
                    </Div>
                </Div>
            </Div>
        </SideProvider>
    );
}
