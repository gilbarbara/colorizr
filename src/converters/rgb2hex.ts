import { addAlphaToHex } from '~/modules/hex-utils';
import { extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HEX, RGB } from '~/types';

/**
 * Convert RGB to HEX.
 *
 * @param input - The RGB color object or tuple.
 * @returns The hex color string.
 */
export default function rgb2hex(input: ConverterParameters<RGB>): HEX {
  const rgb = parseInput(input, 'rgb');
  const alpha = extractAlpha(input);

  const hex: HEX = `#${[rgb.r, rgb.g, rgb.b]
    .map(d => `0${Math.floor(d).toString(16)}`.slice(-2))
    .join('')}`;

  return alpha !== undefined && alpha < 1 ? addAlphaToHex(hex, alpha) : hex;
}
