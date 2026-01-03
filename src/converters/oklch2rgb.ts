import oklab2rgb from '~/converters/oklab2rgb';
import oklch2oklab from '~/converters/oklch2oklab';
import { addAlpha, extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, LCH, RGB } from '~/types';

/**
 * Convert OkLCH to RGB.
 *
 * @param input - The OkLCH color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The RGB color object.
 */
export default function oklch2rgb(input: ConverterParameters<LCH>, precision = 0): RGB {
  const value = parseInput(input, 'oklch');
  const alpha = extractAlpha(input);

  return addAlpha(oklab2rgb(oklch2oklab(value), precision), alpha);
}
