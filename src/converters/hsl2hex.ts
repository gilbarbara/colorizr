import hsl2rgb from '~/converters/hsl2rgb';
import rgb2hex from '~/converters/rgb2hex';
import { addAlphaToHex } from '~/modules/hex-utils';
import { extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HEX, HSL } from '~/types';

/**
 * Convert HSL to HEX.
 *
 * @param input - The HSL color object or tuple.
 * @returns The hex color string.
 */
export default function hsl2hex(input: ConverterParameters<HSL>): HEX {
  const value = parseInput(input, 'hsl');
  const alpha = extractAlpha(input);

  const hex = rgb2hex(hsl2rgb(value));

  return alpha !== undefined && alpha < 1 ? addAlphaToHex(hex, alpha) : hex;
}
