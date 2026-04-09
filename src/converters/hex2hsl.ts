import hex2rgb from '~/converters/hex2rgb';
import rgb2hsl from '~/converters/rgb2hsl';
import { addAlpha, extractAlphaFromHex } from '~/modules/alpha';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex } from '~/modules/validators';

import { HSL } from '~/types';

/**
 * Convert HEX to HSL.
 *
 * @param input - The hex color string.
 * @returns The HSL color object.
 */
export default function hex2hsl(input: string): HSL {
  invariant(isHex(input), MESSAGES.inputHex);

  const alpha = extractAlphaFromHex(input);

  return addAlpha(rgb2hsl(hex2rgb(input)), alpha);
}
