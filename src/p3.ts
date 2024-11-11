import { LAB_TO_LMS, LSM_TO_RGB, MESSAGES, PRECISION, SRGB_TO_P3 } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isNumber, isString } from '~/modules/validators';

import { oklch2oklab } from '~/converters';
import parseCSS from '~/parse-css';
import { ColorTuple, LCH } from '~/types';

function multiplyMatrix(matrix: number[][], vector: ColorTuple): ColorTuple {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2],
  ];
}

function isInP3Gamut(color: ColorTuple): boolean {
  const epsilon = 0.000001;

  return color.every(component => component >= 0 - epsilon && component <= 1 + epsilon);
}

function oklabToLinearSRGB(L: number, a: number, b: number): ColorTuple {
  const l = (L + LAB_TO_LMS.l[0] * a + LAB_TO_LMS.l[1] * b) ** 3;
  const m = (L + LAB_TO_LMS.m[0] * a + LAB_TO_LMS.m[1] * b) ** 3;
  const s = (L + LAB_TO_LMS.s[0] * a + LAB_TO_LMS.s[1] * b) ** 3;

  return [
    LSM_TO_RGB.r[0] * l + LSM_TO_RGB.r[1] * m + LSM_TO_RGB.r[2] * s,
    LSM_TO_RGB.g[0] * l + LSM_TO_RGB.g[1] * m + LSM_TO_RGB.g[2] * s,
    LSM_TO_RGB.b[0] * l + LSM_TO_RGB.b[1] * m + LSM_TO_RGB.b[2] * s,
  ];
}

function oklabToLinearP3(L: number, a: number, b: number): ColorTuple {
  const srgb = oklabToLinearSRGB(L, a, b);

  return multiplyMatrix(SRGB_TO_P3, srgb);
}

/**
 * Get the maximum chroma for a given lightness and hue in the OkLCH color space
 */
export function getOkLCHMaxChroma(input: string | LCH, precision = PRECISION): number {
  const { l, h } = isString(input) ? parseCSS(input, 'oklch') : input;

  invariant(isNumber(l) && l >= 0 && l <= 1, MESSAGES.lightnessRange);
  invariant(isNumber(h) && h >= 0 && h <= 360, MESSAGES.hueRange);

  // Binary search parameters
  const epsilon = 0.000001;
  let low = 0;
  let high = 0.5; // Increased max theoretical chroma

  while (high - low > epsilon) {
    const mid = (low + high) / 2;
    const { l: L, a, b } = oklch2oklab({ l, c: mid, h }, 16);

    const p3Color = oklabToLinearP3(L, a, b);

    if (isInP3Gamut(p3Color)) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return round(low, precision);
}

/**
 * Get a OkLCH color in the P3 color space.
 */
export function getP3Color(input: string | LCH): string {
  const lch = isString(input) ? parseCSS(input, 'oklch') : input;

  return `oklch(${lch.l} ${getOkLCHMaxChroma(lch)} ${lch.h})`;
}
