import { MESSAGES, PRECISION } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

/**
 * Get the brightness difference between 2 colors.
 *
 * @param left - The first color string.
 * @param right - The second color string.
 * @param precision - The decimal precision (default: 5).
 * @returns The brightness difference value.
 */
export default function brightnessDifference(
  left: string,
  right: string,
  precision = PRECISION,
): number {
  invariant(isString(left), MESSAGES.left);
  invariant(isString(right), MESSAGES.right);

  const RGBLeft = parseCSS(left, 'rgb');
  const RGBRight = parseCSS(right, 'rgb');

  const brightnessLeft = (RGBLeft.r * 299 + RGBLeft.g * 587 + RGBLeft.b * 114) / 1000;
  const brightnessRight = (RGBRight.r * 299 + RGBRight.g * 587 + RGBRight.b * 114) / 1000;

  return round(Math.abs(brightnessRight - brightnessLeft), precision);
}
