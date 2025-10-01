import { ComponentChildren, JSX } from 'preact';
import { Css } from '@common/ui/css';
import { DivProps } from './types';
import { sum } from '@common/utils';
import { CSSProperties, useMemo } from 'preact/compat';

const c = Css('Grid', {
  '': {
    m: 0.5,
  },
  Head: {
    fRow: ['center', 'space-between'],
  },
  Body: {
    fCol: ['stretch', 'start'],
  },
  Row: {
    fRow: ['center', 'space-between'],
    w: '100%',
    bg: 'b0',
    fg: 't2',
  },
  'Row:nth-child(even)': { bg: 'b2', rounded: 2 },
  'Row:hover': { bg: 'trHover' },
  Cell: {
    position: 'relative',
    fRow: ['center', 'space-around'],
    textAlign: 'left',
    px: 0.5,
    h: 4,
  },
  'Cell input': {
    background: 'transparent',
    border: 0,
  },
});

export type GridCol<T extends {} = any, C extends {} = any> = {
  title?: string | ComponentChildren;
  cls?: string;
  val?: (item: T, ctx: C) => ComponentChildren;
  w?: number;
};

export type GridComputedCol = GridCol & {
  key: string;
  style: CSSProperties;
  val: (item: any, ctx: any) => ComponentChildren;
};

export type GridCols<T extends {} = any, C extends {} = any> = {
  [K: string]: false | null | undefined | GridCol<T, C>;
}

// default w = 100

// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', w: 70 },
//   { field: 'firstName', headerName: 'First name', w: 130 },
//   { field: 'lastName', headerName: 'Last name', w: 130 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

export interface GridProps<T extends {} = any, C extends {} = any> extends DivProps {
  ctx: C;
  cols: GridCols<T, C>;
  select?: boolean;
  getKey?: (row: T, index: number) => string;
  items: T[];
}

export interface IGrid {
  <T extends {} = any, C extends {} = any>(props: GridProps<T, C>): JSX.Element;
}

const defaultGetKey = (row: any, index: number) => row.id || index;

export const Grid = (({ cols, ctx, select, getKey, items, ...props }: GridProps) => {
  if (!getKey) getKey = defaultGetKey;

  const computedCols = useMemo(() => {
    const wTotal = sum(Object.values(cols).map((c) => c ? c.w || 100 : 0));
    const results: GridComputedCol[] = [];
    for (const [key, col] of Object.entries(cols)) {
      if (!col) continue;
      results.push({
        ...col,
        key,
        style: {
          width: (100 * (col.w || 100)) / wTotal + '%'
        },
        val: col.val || ((item) => item[key]),
      })
    }
    return results;
  }, [cols]);

  return (
    <div {...props} class={c('', props)}>
      <div class={c('Head')}>
        {computedCols.map((col) => (
          <div key={col.key} class={c('Cell', col.cls)} style={col.style}>
            {col.title}
          </div>
        ))}
      </div>
      <div class={c('Body')}>
        {items.map((row: any, index: number) => (
          <div key={getKey(row, index)} class={c('Row')}>
            {computedCols.map((col) => (
              <div key={col.key} class={c('Cell', col.cls)} style={col.style}>
                {col.val(row, ctx)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}) as IGrid;
