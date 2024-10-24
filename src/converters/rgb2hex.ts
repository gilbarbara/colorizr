import { parseInput } from '~/modules/utils';

import { ConverterParameters, HEX, RGB } from '~/types';

/** Convert RGB to HEX */
export default function rgb2hex(input: ConverterParameters<RGB>): HEX {
  const rgb = parseInput(input, 'rgb');

  return `#${Object.values(rgb)
    .map(d => `0${Math.floor(d).toString(16)}`.slice(-2))
    .join('')}`;
}
