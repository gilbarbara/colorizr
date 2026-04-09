import { addAlpha, extractAlpha } from '~/modules/alpha';
import { RAD2DEG } from '~/modules/constants';
import { parseInput, restrictValues } from '~/modules/utils';

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
  const { l, a, b } = parseInput(input, 'oklab');
  const alpha = extractAlpha(input);

  const c = sqrt(a ** 2 + b ** 2);
  let h = (atan2(b, a) * RAD2DEG + 360) % 360;

  if (c < 1e-6) {
    h = 0;
  }

  return addAlpha(restrictValues({ l, c, h }, precision), alpha);
}
