import hsl2rgb from '~/converters/hsl2rgb';
import rgb2oklch from '~/converters/rgb2oklch';
import { addAlpha, extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HSL, LCH } from '~/types';

/**
 * Convert HSL to OkLCH.
 *
 * @param input - The HSL color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLCH color object.
 */
export default function hsl2oklch(input: ConverterParameters<HSL>, precision?: number): LCH {
  const value = parseInput(input, 'hsl');
  const alpha = extractAlpha(input);

  return addAlpha(rgb2oklch(hsl2rgb(value), precision), alpha);
}
