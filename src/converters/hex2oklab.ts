import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex } from '~/modules/validators';

import hex2rgb from '~/converters/hex2rgb';
import rgb2oklab from '~/converters/rgb2oklab';
import { LAB } from '~/types';

/** Convert HEX to oklab */
export default function hex2oklab(input: string, precision?: number): LAB {
  invariant(isHex(input), MESSAGES.inputHex);

  return rgb2oklab(hex2rgb(input), precision);
}
