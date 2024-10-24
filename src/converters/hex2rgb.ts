import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex } from '~/modules/validators';

import formatHex from '~/format-hex';
import { RGB } from '~/types';

/** Convert HEX to RGB */
export default function hex2rgb(input: string): RGB {
  invariant(isHex(input), MESSAGES.inputHex);

  const hex = formatHex(input).slice(1);

  return {
    r: parseInt(hex.charAt(0) + hex.charAt(1), 16),
    g: parseInt(hex.charAt(2) + hex.charAt(3), 16),
    b: parseInt(hex.charAt(4) + hex.charAt(5), 16),
  };
}
