import { LAB_TO_LMS, LSM_TO_RGB, SRGB_TO_P3 } from '~/modules/constants';

import { ColorTuple } from '~/types';

const EPSILON = 0.000001;

function isInGamut(color: ColorTuple): boolean {
  return color.every(component => component >= 0 - EPSILON && component <= 1 + EPSILON);
}

function multiplyMatrix(matrix: number[][], vector: ColorTuple): ColorTuple {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2],
  ];
}

export function isInP3Gamut(color: ColorTuple): boolean {
  return isInGamut(color);
}

export function isInSRGBGamut(color: ColorTuple): boolean {
  return isInGamut(color);
}

export function oklabToLinearP3(L: number, a: number, b: number): ColorTuple {
  return multiplyMatrix(SRGB_TO_P3, oklabToLinearSRGB(L, a, b));
}

export function oklabToLinearSRGB(L: number, a: number, b: number): ColorTuple {
  const l = (L + LAB_TO_LMS.l[0] * a + LAB_TO_LMS.l[1] * b) ** 3;
  const m = (L + LAB_TO_LMS.m[0] * a + LAB_TO_LMS.m[1] * b) ** 3;
  const s = (L + LAB_TO_LMS.s[0] * a + LAB_TO_LMS.s[1] * b) ** 3;

  return [
    LSM_TO_RGB.r[0] * l + LSM_TO_RGB.r[1] * m + LSM_TO_RGB.r[2] * s,
    LSM_TO_RGB.g[0] * l + LSM_TO_RGB.g[1] * m + LSM_TO_RGB.g[2] * s,
    LSM_TO_RGB.b[0] * l + LSM_TO_RGB.b[1] * m + LSM_TO_RGB.b[2] * s,
  ];
}
