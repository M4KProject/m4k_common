import { Css, flexColumn, flexRow } from '@common/ui';
import { Div, DivProps } from './Div';

const css = Css('Flex', {
  '&Row': {
    ...flexRow({ align: 'center', justify: 'between' })
  },
  '&Col': {
    ...flexColumn({ align: 'stretch', justify: 'between' })
  },
});

export const FlexRow = ({ cls, ...props }: DivProps) => {
  return (
    <Div cls={[css(`Row`), cls]} {...props} />
  )
};

export const FlexCol = ({ cls, ...props }: DivProps) => {
  return (
    <Div cls={[css(`Col`), cls]} {...props} />
  )
};
