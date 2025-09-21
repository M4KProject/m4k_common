import { Css } from '@common/ui/html';
import { flexRow } from '@common/ui/flexBox';
import { Div, DivProps } from './Div';

const css = Css('Toolbar', {
  '&': {
    bg: 'white',
    border: '1px solid #ddd',
    px: 0.5,
    mx: 0.5,
    my: 0,
    elevation: 1,
    ...flexRow({ align: 'center', justify: 'between' }),
  },
});

export const Toolbar = ({ cls, ...props }: DivProps) => {
  const c = css();
  return <Div cls={[c, cls]} {...props} />;
};
