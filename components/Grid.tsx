import { ComponentChildren, JSX } from 'preact';
import { Css } from '@common/ui/css';
import { DivProps } from './types';
import { sum } from '@common/utils';
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
  'Cell .Field': {
    w: 'auto',
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

export type GridComputedCol = GridCol & {
  key: string;
  val: (item: any, ctx: any, index: number) => ComponentChildren;
  props: (item: any, ctx: any, index: number) => DivProps;
  if: (col: GridCol, ctx: any) => boolean;
};

export type GridCols<T extends {} = any, C extends {} = any> = {
  [K: string]: false | null | undefined | GridCol<T, C>;
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

export const Grid = (({ cols, ctx, select, getKey, rowProps, items, ...props }: GridProps) => {
  if (!getKey) getKey = defaultGetKey;

  const computedCols = useMemo(() => {
    const entries = Object.entries(cols);
    const wTotal = sum(entries.map(([_, c]) => (c ? c.w || 100 : 0)));
    const results: GridComputedCol[] = [];
    for (const [key, col] of entries) {
      if (!col) continue;
      const width = (100 * (col.w || 100)) / wTotal + '%';
      results.push({
        ...col,
        key,
        if: col.if || (() => true),
        props: (item, ctx, index) => {
          const props = col.props ? col.props(item, ctx, index) : ({} as DivProps);
          return {
            ...props,
            class: c('Cell', col.cls, props),
            style: { width, ...props.style },
          };
        },
        val: col.val || ((item) => item[key]),
      });
    }
    return results;
  }, [cols]);

  const visibleCols = computedCols.filter((col) => col.if(col, ctx));

  return (
    <div {...props} class={c('', props)}>
      <div class={c('Head')}>
        {visibleCols.map((col) => (
          <div key={col.key} {...col.props({}, ctx, -1)}>
            {col.title}
          </div>
        ))}
      </div>
      <div class={c('Body')}>
        {items.map((item: any, index: number) => {
          const { mode, ...props } = rowProps ? rowProps(item, ctx, index) : {};
          return (
            <div
              key={getKey(item, index)}
              {...props}
              class={c('Row', mode && `Row-${mode}`, props)}
            >
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
