import { parseInput } from '~/modules/utils';

import hsl2rgb from '~/converters/hsl2rgb';
import rgb2hex from '~/converters/rgb2hex';
import { ConverterParameters, HEX, HSL } from '~/types';

/** Convert HSL to HEX */
export default function hsl2hex(input: ConverterParameters<HSL>): HEX {
  const value = parseInput(input, 'hsl');

  return rgb2hex(hsl2rgb(value));
}
