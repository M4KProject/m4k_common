import { Css, flexColumn, flexRow } from '@common/ui';
import { DivProps } from './Div';

const c = Css('Flex', {
  '&Row': {
    ...flexRow({ align: 'center', justify: 'between' }),
  },
  '&Col': {
    ...flexColumn({ align: 'stretch', justify: 'between' }),
  },
});

export const FlexRow = (props: DivProps) => {
  return <div {...props} class={c(`Row`, props)} />;
};

export const FlexCol = (props: DivProps) => {
  return <div {...props} class={c(`Col`, props)} />;
};
