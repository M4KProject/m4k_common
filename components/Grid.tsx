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
};

export type GridComputedCol = GridCol & {
  key: string;
  val: (item: any, ctx: any, index: number) => ComponentChildren;
  props: (item: any, ctx: any, index: number) => DivProps;
};

export type GridCols<T extends {} = any, C extends {} = any> = {
  [K: string]: false | null | undefined | GridCol<T, C>;
};

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
    const wTotal = sum(Object.values(cols).map((c) => (c ? c.w || 100 : 0)));
    const results: GridComputedCol[] = [];
    for (const [key, col] of Object.entries(cols)) {
      if (!col) continue;
      const width = (100 * (col.w || 100)) / wTotal + '%';
      results.push({
        ...col,
        key,
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

  return (
    <div {...props} class={c('', props)}>
      <div class={c('Head')}>
        {computedCols.map((col) => (
          <div key={col.key} {...col.props({}, ctx, -1)}>
            {col.title}
          </div>
        ))}
      </div>
      <div class={c('Body')}>
        {items.map((item: any, index: number) => (
          <div key={getKey(item, index)} class={c('Row')}>
            {computedCols.map((col) => (
              <div key={col.key} {...col.props(item, ctx, index)}>
                {col.val(item, ctx, index)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}) as IGrid;
