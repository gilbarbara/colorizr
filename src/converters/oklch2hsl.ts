import { parseInput } from '~/modules/utils';

import oklch2rgb from '~/converters/oklch2rgb';
import rgb2hsl from '~/converters/rgb2hsl';
import { ConverterParameters, HSL, LCH } from '~/types';

/** Convert oklch to HSL */
export default function oklch2hsl(input: ConverterParameters<LCH>): HSL {
  const value = parseInput(input, 'oklch');

  return rgb2hsl(oklch2rgb(value));
}
