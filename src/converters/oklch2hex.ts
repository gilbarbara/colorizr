import { parseInput } from '~/modules/utils';

import oklch2rgb from '~/converters/oklch2rgb';
import rgb2hex from '~/converters/rgb2hex';
import { ConverterParameters, HEX, LCH } from '~/types';

/** Convert oklch to HEX */
export default function oklch2hex(input: ConverterParameters<LCH>): HEX {
  const value = parseInput(input, 'oklch');

  return rgb2hex(oklch2rgb(value));
}
