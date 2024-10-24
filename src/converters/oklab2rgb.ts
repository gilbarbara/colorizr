import { LAB_TO_LMS, LSM_TO_RGB } from '~/modules/constants';
import { clamp, parseInput, round } from '~/modules/utils';

import { ConverterParameters, LAB, RGB } from '~/types';

const { abs } = Math;

function lrgb2rgb(input: number) {
  const absoluteNumber = abs(input);
  const sign = input < 0 ? -1 : 1;

  if (absoluteNumber > 0.0031308) {
    return sign * (absoluteNumber ** (1 / 2.4) * 1.055 - 0.055);
  }

  return input * 12.92;
}

/** Convert oklab to RGB */
export default function oklab2rgb(input: ConverterParameters<LAB>, precision = 0): RGB {
  const { l: L, a: A, b: B } = parseInput(input, 'oklab');

  const l = (L + LAB_TO_LMS.l[0] * A + LAB_TO_LMS.l[1] * B) ** 3;
  const m = (L + LAB_TO_LMS.m[0] * A + LAB_TO_LMS.m[1] * B) ** 3;
  const s = (L + LAB_TO_LMS.s[0] * A + LAB_TO_LMS.s[1] * B) ** 3;

  const r = 255 * lrgb2rgb(LSM_TO_RGB.r[0] * l + LSM_TO_RGB.r[1] * m + LSM_TO_RGB.r[2] * s);
  const g = 255 * lrgb2rgb(LSM_TO_RGB.g[0] * l + LSM_TO_RGB.g[1] * m + LSM_TO_RGB.g[2] * s);
  const b = 255 * lrgb2rgb(LSM_TO_RGB.b[0] * l + LSM_TO_RGB.b[1] * m + LSM_TO_RGB.b[2] * s);

  return {
    r: clamp(round(r, precision), 0, 255),
    g: clamp(round(g, precision), 0, 255),
    b: clamp(round(b, precision), 0, 255),
  };
}
