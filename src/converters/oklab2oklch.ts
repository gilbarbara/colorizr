import { RAD2DEG } from '~/modules/constants';
import { addAlpha, extractAlpha, parseInput, restrictValues, round } from '~/modules/utils';

import { ConverterParameters, LAB, LCH } from '~/types';

const { atan2, sqrt } = Math;

/**
 * Convert OkLab to OkLCH.
 *
 * @param input - The OkLab color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLCH color object.
 */
export default function oklab2oklch(input: ConverterParameters<LAB>, precision?: number): LCH {
  const { l, a, b } = restrictValues(parseInput(input, 'oklab'));
  const alpha = extractAlpha(input);

  const c = sqrt(a ** 2 + b ** 2);
  let h = (atan2(b, a) * RAD2DEG + 360) % 360;

  if (round(c * 10000) === 0) {
    h = 0;
  }

  return addAlpha(restrictValues({ l, c, h }, precision), alpha);
}
