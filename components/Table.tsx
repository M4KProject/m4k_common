import { JSX } from 'preact';
import { Css, clsx } from '@common/ui/html';
import { flexCenter, flexColumn, flexRow } from '@common/ui/flexBox';

const c = Css('Table', {
  '': {
    border: 0,
    borderCollapse: 'collapse',
    m: 0.5,
    rounded: 2,
    elevation: 1,
  },
  Row: {
    borderCollapse: 'collapse',
    w: '100%',
  },
  'Row-success': { fg: 'success' },
  'Row-error': { fg: 'error' },
  'Row-selected': { fg: 'selected' },
  'Row:nth-child(even)': { bg: '#ffffff70' },
  'Row:hover': { bg: 'transparent', elevation: 1 },
  Cell: {
    border: '1px solid #ddd',
    textAlign: 'left',
    h: 3,
  },
  CellContent: {
    ...flexColumn({ align: 'stretch', justify: 'center' }),
    px: 0.5,
    position: 'relative',
    h: 3,
  },
  'Cell-row &CellContent': {
    ...flexRow({ align: 'center', justify: 'start' }),
  },
  'Cell-center &CellContent': {
    ...flexCenter({}),
  },
  'Cell-around &CellContent': {
    ...flexRow({ align: 'center', justify: 'around' }),
  },
  'Cell-check': {
    width: 0,
  },
  'Cell-header': {
    pt: 1,
    bg: 'white',
    fg: 'primary',
    borderTop: 0,
  },
  ' input': {
    background: 'transparent',
    border: 0,
  },
  ' *[draggable="true"]': {
    cursor: 'grab',
  },
  ' .dragging': {
    // visibility: 'hidden',
  },
});

export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {
  class?: string;
}
export const Table = (props: TableProps) => {
  return <table {...props} class={c('', props)} />;
};

export interface TableHeadProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  class?: any;
}
export const TableHead = (props: TableHeadProps) => {
  return <thead {...props} class={c('Head', props)} />;
};

export interface TableBodyProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  class?: string;
}
export const TableBody = (props: TableBodyProps) => {
  return <tbody {...props} class={c('Body', props)} />;
};

export interface TableFootProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {
  class?: string;
}
export const TableFoot = (props: TableFootProps) => {
  return <tfoot {...props} class={c('Foot', props)} />;
};

export interface RowProps extends JSX.HTMLAttributes<HTMLTableRowElement> {
  mode?: 'success' | 'error' | 'selected';
  class?: string;
}
export const Row = (props: RowProps) => {
  return <tr {...props} class={c('Row', props.mode && `Row-${props.mode}`, props)} />;
};

export interface CellProps extends JSX.HTMLAttributes<HTMLTableCellElement> {
  variant?: 'row' | 'center' | 'around' | 'check';
  class?: string;
}
export const Cell = ({ variant, children, ...props }: CellProps) => {
  return (
    <td {...props} class={c('Cell', variant && `Cell-${variant}`, props)}>
      <div class={c('CellContent')}>{children}</div>
    </td>
  );
};

export interface CellHeaderProps extends JSX.HTMLAttributes<HTMLTableCellElement> {
  variant?: 'row' | 'center';
  class?: string;
}
export const CellHeader = ({ variant, children, ...props }: CellHeaderProps) => {
  return (
    <th {...props} class={c('Cell', 'Cell-header', variant && `Cell-${variant}`, props)}>
      <div class={c('CellContent')}>{children}</div>
    </th>
  );
};
