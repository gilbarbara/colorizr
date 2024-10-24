import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex } from '~/modules/validators';

import hex2rgb from '~/converters/hex2rgb';
import rgb2hsl from '~/converters/rgb2hsl';
import { HSL } from '~/types';

/** Convert HEX to HSL */
export default function hex2hsl(input: string): HSL {
  invariant(isHex(input), MESSAGES.inputHex);

  return rgb2hsl(hex2rgb(input));
}
