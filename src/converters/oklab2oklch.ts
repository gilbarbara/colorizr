import { RAD2DEG } from '~/modules/constants';
import { parseInput, restrictValues, round } from '~/modules/utils';

import { ConverterParameters, LAB, LCH } from '~/types';

const { atan2, sqrt } = Math;

/** Convert oklab to oklch */
export default function oklab2oklch(input: ConverterParameters<LAB>, precision?: number): LCH {
  const { l, a, b } = restrictValues(parseInput(input, 'oklab'));

  const c = sqrt(a ** 2 + b ** 2);
  let h = (atan2(b, a) * RAD2DEG + 360) % 360;

  if (round(c * 10000) === 0) {
    h = 0;
  }

  return restrictValues({ l, c, h }, precision);
}
