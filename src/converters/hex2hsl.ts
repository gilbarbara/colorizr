import hex2rgb from '~/converters/hex2rgb';
import rgb2hsl from '~/converters/rgb2hsl';
import { MESSAGES } from '~/modules/constants';
import { extractAlphaFromHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { addAlpha } from '~/modules/utils';
import { isHex } from '~/modules/validators';

import { HSL } from '~/types';

/** Convert HEX to HSL */
export default function hex2hsl(input: string): HSL {
  invariant(isHex(input), MESSAGES.inputHex);

  const alpha = extractAlphaFromHex(input);

  return addAlpha(rgb2hsl(hex2rgb(input)), alpha);
}
