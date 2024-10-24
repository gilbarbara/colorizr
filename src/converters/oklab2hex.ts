import { parseInput } from '~/modules/utils';

import oklab2rgb from '~/converters/oklab2rgb';
import rgb2hex from '~/converters/rgb2hex';
import { ConverterParameters, HEX, LAB } from '~/types';

/** Convert oklab to HEX */
export default function oklab2hex(input: ConverterParameters<LAB>): HEX {
  const value = parseInput(input, 'oklab');

  return rgb2hex(oklab2rgb(value));
}
