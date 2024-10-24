import { MESSAGES } from '~/modules/constants';
import { cssColors } from '~/modules/css-colors';
import { extractAlphaFromHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { isHex, isString } from '~/modules/validators';

import extractColorParts from '~/extract-color-parts';

export default function opacity(input: string): number {
  invariant(isString(input), MESSAGES.inputString);

  if (isHex(input)) {
    return extractAlphaFromHex(input);
  } else if (Object.keys(cssColors).includes(input)) {
    return 1;
  }

  const { alpha } = extractColorParts(input);

  if (!alpha) {
    return 1;
  }

  return alpha;
}
