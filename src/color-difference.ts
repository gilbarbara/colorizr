import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { isString } from '~/modules/validators';

/**
 * Get the color difference between 2 colors.
 *
 * @param left - The first color string.
 * @param right - The second color string.
 * @returns The color difference value.
 */
export default function colorDifference(left: string, right: string): number {
  invariant(isString(left), MESSAGES.left);
  invariant(isString(right), MESSAGES.right);

  const RGBLeft = resolveColor(left).rgb;
  const RGBRight = resolveColor(right).rgb;

  return (
    Math.max(RGBLeft.r, RGBRight.r) -
    Math.min(RGBLeft.r, RGBRight.r) +
    (Math.max(RGBLeft.g, RGBRight.g) - Math.min(RGBLeft.g, RGBRight.g)) +
    (Math.max(RGBLeft.b, RGBRight.b) - Math.min(RGBLeft.b, RGBRight.b))
  );
}
