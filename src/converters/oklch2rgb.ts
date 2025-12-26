import oklab2rgb from '~/converters/oklab2rgb';
import oklch2oklab from '~/converters/oklch2oklab';
import { addAlpha, extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, LCH, RGB } from '~/types';

/** Convert oklch to RGB */
export default function oklch2rgb(input: ConverterParameters<LCH>, precision = 0): RGB {
  const value = parseInput(input, 'oklch');
  const alpha = extractAlpha(input);

  return addAlpha(oklab2rgb(oklch2oklab(value), precision), alpha);
}
