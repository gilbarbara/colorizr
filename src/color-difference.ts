import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

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

  const RGBLeft = parseCSS(left, 'rgb');
  const RGBRight = parseCSS(right, 'rgb');

  return (
    Math.max(RGBLeft.r, RGBRight.r) -
    Math.min(RGBLeft.r, RGBRight.r) +
    (Math.max(RGBLeft.g, RGBRight.g) - Math.min(RGBLeft.g, RGBRight.g)) +
    (Math.max(RGBLeft.b, RGBRight.b) - Math.min(RGBLeft.b, RGBRight.b))
  );
}
