import hex2rgb from '~/converters/hex2rgb';
import rgb2oklch from '~/converters/rgb2oklch';
import { MESSAGES } from '~/modules/constants';
import { extractAlphaFromHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { addAlpha } from '~/modules/utils';
import { isHex } from '~/modules/validators';

import { LCH } from '~/types';

/**
 * Convert HEX to OkLCH.
 *
 * @param input - The hex color string.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLCH color object.
 */
export default function hex2oklch(input: string, precision?: number): LCH {
  invariant(isHex(input), MESSAGES.inputHex);

  const alpha = extractAlphaFromHex(input);

  return addAlpha(rgb2oklch(hex2rgb(input), precision), alpha);
}
