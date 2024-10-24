import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex } from '~/modules/validators';

import hex2rgb from '~/converters/hex2rgb';
import rgb2oklch from '~/converters/rgb2oklch';
import { LCH } from '~/types';

/** Convert HEX to oklch */
export default function hex2oklch(input: string, precision?: number): LCH {
  invariant(isHex(input), MESSAGES.inputHex);

  return rgb2oklch(hex2rgb(input), precision);
}
