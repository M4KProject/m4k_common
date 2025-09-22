import { Css } from '@common/ui';
import { DivProps } from './Div';

const c = Css('Flex', {
  Row: {
    fRow: 1,
  },
  Col: {
    fCol: 1,
  },
});

export const FlexRow = (props: DivProps) => {
  return <div {...props} class={c(`Row`, props)} />;
};

export const FlexCol = (props: DivProps) => {
  return <div {...props} class={c(`Col`, props)} />;
};
