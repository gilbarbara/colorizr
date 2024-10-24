import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isString } from '~/modules/validators';

import parseCSS from '~/parse-css';

/**
 * Get the difference between 2 colors.
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
