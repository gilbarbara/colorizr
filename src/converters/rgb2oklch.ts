import oklab2oklch from '~/converters/oklab2oklch';
import rgb2oklab from '~/converters/rgb2oklab';
import { addAlpha, extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, LCH, RGB } from '~/types';

/**
 * Convert RGB to OkLCH.
 *
 * @param input - The RGB color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLCH color object.
 */
export default function rgb2oklch(input: ConverterParameters<RGB>, precision?: number): LCH {
  const value = parseInput(input, 'rgb');
  const alpha = extractAlpha(input);

  return addAlpha(oklab2oklch(rgb2oklab(value, precision), precision), alpha);
}
