import { ComponentChildren, JSX } from 'preact';
import { Css } from '@common/ui/css';
import { DivProps } from './types';
import { isArray, sum, toTrue } from 'fluxio';
import { useMemo } from 'preact/compat';

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
  'Row-success': { fg: 'success' },
  'Row-error': { fg: 'error' },
  'Row-selected': { fg: 'selected' },
  Cell: {
    position: 'relative',
    fRow: ['center', 'space-around'],
    textAlign: 'left',
    px: 0.5,
    h: 3,
  },
  'Cell input': {
    background: 'transparent',
    border: 0,
  },
});

export type GridCol<T extends {} = any, C extends {} = any> = {
  w?: number;
  title?: string | ComponentChildren;
  cls?: string;
  val?: (item: T, ctx: C, index: number) => ComponentChildren;
  props?: (item: T, ctx: C, index: number) => DivProps;
  if?: (col: GridCol<T, C>, ctx: C) => boolean;
};

export type ArrayGridCol<T extends {} = any, C extends {} = any> =
  | [string | ComponentChildren, (item: T, ctx: C, index: number) => ComponentChildren]
  | [
      string | ComponentChildren,
      (item: T, ctx: C, index: number) => ComponentChildren,
      {
        w?: number;
        cls?: string;
        props?: (item: T, ctx: C, index: number) => DivProps;
        if?: (col: GridCol<T, C>, ctx: C) => boolean;
      },
    ];

export type GridComputedCol = GridCol & {
  key: string;
  val: (item: any, ctx: any, index: number) => ComponentChildren;
  props: (item: any, ctx: any, index: number) => DivProps;
  if: (col: GridCol, ctx: any) => boolean;
};

export type GridCols<T extends {} = any, C extends {} = any> = {
  [K: string]: false | null | undefined | ArrayGridCol<T, C> | GridCol<T, C>;
};

export interface GridProps<T extends {} = any, C extends {} = any> extends DivProps {
  ctx: C;
  cols: GridCols<T, C>;
  select?: boolean;
  getKey?: (row: T, index: number) => string;
  rowProps?: (
    item: T,
    ctx: C,
    index: number
  ) => DivProps & { mode?: 'success' | 'error' | 'selected' };
  items: T[];
}

export interface IGrid {
  <T extends {} = any, C extends {} = any>(props: GridProps<T, C>): JSX.Element;
}

const defaultGetKey = (row: any, index: number) => row.id || index;

const getComputedCols = (cols: GridCols<any, any>) => {
  const computedCols: GridComputedCol[] = [];

  for (const [key, data] of Object.entries(cols)) {
    if (!data) continue;

    const col = (
      isArray(data) ?
        {
          ...data[2],
          title: data[0],
          val: data[1],
        }
      : {
          ...data,
        }) as GridComputedCol;

    col.key = key;

    computedCols.push(col);
  }

  const wTotal = sum(computedCols.map((col) => col.w || 100));

  for (const col of computedCols) {
    if (!col.if) col.if = toTrue;
    const width = (100 * (col.w || 100)) / wTotal + '%';
    const getProps = col.props;
    col.props = (item, ctx, index) => {
      const props = getProps ? getProps(item, ctx, index) : ({} as DivProps);
      return {
        ...props,
        ...c('Cell', col.cls, props),
        style: { width, ...props.style },
      };
    };
  }

  return computedCols;
};

export const Grid = (({ cols, ctx, select, getKey, rowProps, items, ...props }: GridProps) => {
  if (!getKey) getKey = defaultGetKey;

  const computedCols = useMemo(() => getComputedCols(cols), [cols]);

  const visibleCols = computedCols.filter((col) => col.if(col, ctx));

  return (
    <div {...props} {...c('', props)}>
      <div {...c('Head')}>
        {visibleCols.map((col) => (
          <div key={col.key} {...col.props({}, ctx, -1)}>
            {col.title}
          </div>
        ))}
      </div>
      <div {...c('Body')}>
        {items.map((item: any, index: number) => {
          const { mode, ...props } = rowProps ? rowProps(item, ctx, index) : {};
          return (
            <div key={getKey(item, index)} {...props} {...c('Row', mode && `Row-${mode}`, props)}>
              {visibleCols.map((col) => (
                <div key={col.key} {...col.props(item, ctx, index)}>
                  {col.val(item, ctx, index)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}) as IGrid;
