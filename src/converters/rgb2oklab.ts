import { LRGB_TO_LMS, LSM_TO_LAB, PRECISION } from '~/modules/constants';
import { parseInput, restrictValues } from '~/modules/utils';

import { ConverterParameters, LAB, RGB } from '~/types';

const { cbrt, sign } = Math;

function rgb2lrgb(input: number) {
  const abs = Math.abs(input);

  if (abs < 0.04045) {
    return input / 12.92;
  }

  return (sign(input) || 1) * ((abs + 0.055) / 1.055) ** 2.4;
}

/** Convert RGB to oklab */
export default function rgb2oklab(input: ConverterParameters<RGB>, precision = PRECISION): LAB {
  const value = parseInput(input, 'rgb');

  const [lr, lg, lb] = [rgb2lrgb(value.r / 255), rgb2lrgb(value.g / 255), rgb2lrgb(value.b / 255)];
  const l = cbrt(LRGB_TO_LMS.l[0] * lr + LRGB_TO_LMS.l[1] * lg + LRGB_TO_LMS.l[2] * lb);
  const m = cbrt(LRGB_TO_LMS.m[0] * lr + LRGB_TO_LMS.m[1] * lg + LRGB_TO_LMS.m[2] * lb);
  const s = cbrt(LRGB_TO_LMS.s[0] * lr + LRGB_TO_LMS.s[1] * lg + LRGB_TO_LMS.s[2] * lb);

  const lab = {
    l: LSM_TO_LAB.l[0] * l + LSM_TO_LAB.l[1] * m - LSM_TO_LAB.l[2] * s,
    a: LSM_TO_LAB.a[0] * l - LSM_TO_LAB.a[1] * m + LSM_TO_LAB.a[2] * s,
    b: LSM_TO_LAB.b[0] * l + LSM_TO_LAB.b[1] * m - LSM_TO_LAB.b[2] * s,
  };

  return restrictValues(lab, precision);
}
