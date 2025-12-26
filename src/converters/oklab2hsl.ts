import oklab2rgb from '~/converters/oklab2rgb';
import rgb2hsl from '~/converters/rgb2hsl';
import { addAlpha, extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HSL, LAB } from '~/types';

/** Convert oklab to HSL */
export default function oklab2hsl(input: ConverterParameters<LAB>): HSL {
  const value = parseInput(input, 'oklab');
  const alpha = extractAlpha(input);

  return addAlpha(rgb2hsl(oklab2rgb(value)), alpha);
}
