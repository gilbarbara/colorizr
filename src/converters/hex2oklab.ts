import hex2rgb from '~/converters/hex2rgb';
import rgb2oklab from '~/converters/rgb2oklab';
import { MESSAGES } from '~/modules/constants';
import { extractAlphaFromHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { addAlpha } from '~/modules/utils';
import { isHex } from '~/modules/validators';

import { LAB } from '~/types';

/**
 * Convert HEX to OkLab.
 *
 * @param input - The hex color string.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLab color object.
 */
export default function hex2oklab(input: string, precision?: number): LAB {
  invariant(isHex(input), MESSAGES.inputHex);

  const alpha = extractAlphaFromHex(input);

  return addAlpha(rgb2oklab(hex2rgb(input), precision), alpha);
}
