import hsl2rgb from '~/converters/hsl2rgb';
import rgb2oklch from '~/converters/rgb2oklch';
import { addAlpha, extractAlpha } from '~/modules/alpha';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { parseInput } from '~/modules/utils';
import { isPrecision } from '~/modules/validators';

import { ConverterParameters, HSL, LCH } from '~/types';

/**
 * Convert HSL to OkLCH.
 *
 * @param input - The HSL color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLCH color object.
 */
export default function hsl2oklch(input: ConverterParameters<HSL>, precision?: number): LCH {
  invariant(precision === undefined || isPrecision(precision, 0), MESSAGES.precision);
  const value = parseInput(input, 'hsl');
  const alpha = extractAlpha(input);

  return addAlpha(rgb2oklch(hsl2rgb(value), precision), alpha);
}
