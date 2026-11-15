import { GAMUT_EPSILON, LMS_TO_LRGB, OKLAB_TO_CLMS, SRGB_TO_P3 } from '~/modules/constants';

import { ColorTuple } from '~/types';

/** Multiply a 3×3 matrix by a 3-component vector. */
function multiplyMatrix(matrix: number[][], vector: ColorTuple): ColorTuple {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2],
  ];
}

/**
 * Check if a linear RGB color is inside its gamut: every channel within 0-1,
 * with a `GAMUT_EPSILON` tolerance for floating-point error.
 * Works for any RGB space, such as linear sRGB or linear Display P3.
 *
 * @param color - The linear RGB channels.
 * @returns True if every channel is in range.
 */
export function isInGamut(color: ColorTuple): boolean {
  return color.every(component => component >= 0 - GAMUT_EPSILON && component <= 1 + GAMUT_EPSILON);
}

/**
 * Convert OkLab to linear Display P3. Channels outside 0-1 mean the color is outside P3.
 *
 * @param L - The OkLab lightness.
 * @param a - The OkLab green-red axis.
 * @param b - The OkLab blue-yellow axis.
 * @returns The linear Display P3 channels.
 */
export function oklabToLinearP3(L: number, a: number, b: number): ColorTuple {
  return multiplyMatrix(SRGB_TO_P3, oklabToLinearSRGB(L, a, b));
}

/**
 * Convert OkLab to linear sRGB. Channels outside 0-1 mean the color is outside sRGB.
 *
 * @param L - The OkLab lightness.
 * @param a - The OkLab green-red axis.
 * @param b - The OkLab blue-yellow axis.
 * @returns The linear sRGB channels.
 */
export function oklabToLinearSRGB(L: number, a: number, b: number): ColorTuple {
  const l = (OKLAB_TO_CLMS[0][0] * L + OKLAB_TO_CLMS[0][1] * a + OKLAB_TO_CLMS[0][2] * b) ** 3;
  const m = (OKLAB_TO_CLMS[1][0] * L + OKLAB_TO_CLMS[1][1] * a + OKLAB_TO_CLMS[1][2] * b) ** 3;
  const s = (OKLAB_TO_CLMS[2][0] * L + OKLAB_TO_CLMS[2][1] * a + OKLAB_TO_CLMS[2][2] * b) ** 3;

  return [
    LMS_TO_LRGB[0][0] * l + LMS_TO_LRGB[0][1] * m + LMS_TO_LRGB[0][2] * s,
    LMS_TO_LRGB[1][0] * l + LMS_TO_LRGB[1][1] * m + LMS_TO_LRGB[1][2] * s,
    LMS_TO_LRGB[2][0] * l + LMS_TO_LRGB[2][1] * m + LMS_TO_LRGB[2][2] * s,
  ];
}
