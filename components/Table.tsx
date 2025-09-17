import { JSX } from 'preact';
import { Css, clsx } from '@common/ui/html';
import { useCss } from '../hooks/useCss';
import { flexCenter, flexColumn, flexRow } from '@common/ui/flexBox';
import { Div } from './Div';

const css: Css = {
  '&': {
    border: 0,
    borderCollapse: 'collapse',
    m: 0.5,
    rounded: 2,
    elevation: 1,
  },
  '&Row': {
    borderCollapse: 'collapse',
    w: '100%',
  },
  '&Row-success': { fg: 'success' },
  '&Row-error': { fg: 'error' },
  '&Row-selected': { fg: 'selected' },
  '&Row:nth-child(even)': { bg: '#ffffff70' },
  '&Row:hover': { bg: 'transparent', elevation: 1 },
  '&Cell': {
    border: '1px solid #ddd',
    textAlign: 'left',
    h: 3,
  },
  '&CellContent': {
    ...flexColumn({ align: 'stretch', justify: 'center' }),
    px: 0.5,
    position: 'relative',
    h: 3,
  },
  '&Cell-row &CellContent': {
    ...flexRow({ align: 'center', justify: 'start' }),
  },
  '&Cell-center &CellContent': {
    ...flexCenter({}),
  },
  '&Cell-around &CellContent': {
    ...flexRow({ align: 'center', justify: 'around' }),
  },
  '&Cell-header': {
    pt: 1,
    bg: 'white',
    fg: 'primary',
    borderTop: 0,
  },
  '& input': {
    background: 'transparent',
    border: 0,
  },
  '& *[draggable="true"]': {
    cursor: 'grab',
  },
  '& .dragging': {
    // visibility: 'hidden',
  },
};

export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {
  cls?: any;
}
export const Table = ({ cls, ...props }: TableProps) => {
  const c = useCss('Table', css);
  return <table class={clsx(c, cls)} {...props} />;
};

export interface TableHeadProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  cls?: any;
}
export const TableHead = ({ cls, ...props }: TableHeadProps) => {
  const c = useCss('Table', css);
  return <thead class={clsx(`${c}Head`, cls)} {...props} />;
};

export interface TableBodyProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  cls?: any;
}
export const TableBody = ({ cls, ...props }: TableBodyProps) => {
  const c = useCss('Table', css);
  return <tbody class={clsx(`${c}Body`, cls)} {...props} />;
};

export interface TableFootProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  cls?: any;
}
export const TableFoot = ({ cls, ...props }: TableFootProps) => {
  const c = useCss('Table', css);
  return <tfoot class={clsx(`${c}Head`, cls)} {...props} />;
};

export interface RowProps extends JSX.HTMLAttributes<HTMLTableRowElement> {
  mode?: 'success' | 'error' | 'selected';
  cls?: any;
}
export const Row = ({ cls, mode, ...props }: RowProps) => {
  const c = useCss('Table', css);
  return <tr class={clsx(`${c}Row`, mode && `${c}Row-${mode}`, cls)} {...props} />;
};

export interface CellProps extends JSX.HTMLAttributes<HTMLTableCellElement> {
  variant?: 'row' | 'center' | 'around';
  cls?: any;
}
export const Cell = ({ cls, variant, children, ...props }: CellProps) => {
  const c = useCss('Table', css);
  return (
    <td class={clsx(`${c}Cell`, variant && `${c}Cell-${variant}`, cls)} {...props}>
      <div class={`${c}CellContent`}>{children}</div>
    </td>
  );
};

export interface CellHeaderProps extends JSX.HTMLAttributes<HTMLTableCellElement> {
  variant?: 'row' | 'center';
  cls?: any;
}
export const CellHeader = ({ cls, variant, children, ...props }: CellHeaderProps) => {
  const c = useCss('Table', css);
  return (
    <th class={clsx(`${c}Cell ${c}Cell-header`, variant && `${c}Cell-${variant}`, cls)} {...props}>
      <Div cls={`${c}CellContent`}>{children}</Div>
    </th>
  );
};
