import hsl2rgb from '~/converters/hsl2rgb';
import rgb2oklab from '~/converters/rgb2oklab';
import { addAlpha, extractAlpha } from '~/modules/alpha';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { parseInput } from '~/modules/utils';
import { isPrecision } from '~/modules/validators';

import { ConverterParameters, HSL, LAB } from '~/types';

/**
 * Convert HSL to OkLab.
 *
 * @param input - The HSL color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLab color object.
 */
export default function hsl2oklab(input: ConverterParameters<HSL>, precision?: number): LAB {
  invariant(precision === undefined || isPrecision(precision, 0), MESSAGES.precision);
  const value = parseInput(input, 'hsl');
  const alpha = extractAlpha(input);

  return addAlpha(rgb2oklab(hsl2rgb(value), precision), alpha);
}
