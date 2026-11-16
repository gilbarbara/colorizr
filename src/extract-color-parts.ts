import hex2rgb from '~/converters/hex2rgb';
import { extractAlphaFromHex } from '~/modules/alpha';
import { ExtractColorPartsReturn, parseColorString } from '~/modules/color-string';
import { COLOR_KEYS } from '~/modules/constants';

export type { ExtractColorPartsReturn } from '~/modules/color-string';

/**
 * Extract the color parts from a CSS color string.
 * Hex and named colors are returned as RGB parts.
 * Out-of-range values are returned as written, not clamped or wrapped.
 *
 * @param input - The CSS color string.
 * @returns An object with the color model and component values.
 */
export default function extractColorParts(input: string): ExtractColorPartsReturn {
  const result = parseColorString(input);

  if (!('hex' in result)) {
    return result.parts;
  }

  const keys = COLOR_KEYS.rgb;
  const { r, g, b } = hex2rgb(result.hex);
  const alpha = extractAlphaFromHex(result.hex);

  return {
    model: 'rgb',
    [keys[0]]: r,
    [keys[1]]: g,
    [keys[2]]: b,
    alpha: alpha < 1 ? alpha : undefined,
  } as ExtractColorPartsReturn;
}
