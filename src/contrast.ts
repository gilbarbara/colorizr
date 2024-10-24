import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isString } from '~/modules/validators';

import getLuminance from '~/luminance';

/**
 * Get the color contrast between 2 colors.
 */
export default function contrast(left: string, right: string): number {
  invariant(isString(left), MESSAGES.left);
  invariant(isString(right), MESSAGES.right);

  const LuminanceLeft = getLuminance(left);
  const LuminanceRight = getLuminance(right);

  return round(
    LuminanceLeft >= LuminanceRight
      ? (LuminanceLeft + 0.05) / (LuminanceRight + 0.05)
      : (LuminanceRight + 0.05) / (LuminanceLeft + 0.05),
  );
}
