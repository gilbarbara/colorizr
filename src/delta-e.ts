import { MESSAGES, PRECISION } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { round } from '~/modules/utils';
import { isString } from '~/modules/validators';

export const DELTA_E_JND = 0.02;

/**
 * Calculate the perceptual color difference (Delta E OK) between two colors.
 * Uses Euclidean distance in OkLab space.
 *
 * @param left - The first color string.
 * @param right - The second color string.
 * @param precision - The number of decimal places for the result.
 * @returns The Delta E OK value.
 */
export default function deltaE(left: string, right: string, precision = PRECISION): number {
  invariant(isString(left), MESSAGES.left);
  invariant(isString(right), MESSAGES.right);

  const lab1 = resolveColor(left).oklab;
  const lab2 = resolveColor(right).oklab;

  return round(
    Math.sqrt((lab1.l - lab2.l) ** 2 + (lab1.a - lab2.a) ** 2 + (lab1.b - lab2.b) ** 2),
    precision,
  );
}
