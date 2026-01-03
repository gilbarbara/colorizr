import oklab2rgb from '~/converters/oklab2rgb';
import rgb2hex from '~/converters/rgb2hex';
import { addAlphaToHex } from '~/modules/hex-utils';
import { extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HEX, LAB } from '~/types';

/**
 * Convert OkLab to HEX.
 *
 * @param input - The OkLab color object or tuple.
 * @returns The hex color string.
 */
export default function oklab2hex(input: ConverterParameters<LAB>): HEX {
  const value = parseInput(input, 'oklab');
  const alpha = extractAlpha(input);

  const hex = rgb2hex(oklab2rgb(value));

  return alpha !== undefined && alpha < 1 ? addAlphaToHex(hex, alpha) : hex;
}
