import { COLOR_KEYS, MESSAGES } from '~/modules/constants';
import { extractAlphaFromHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { hasValidMatches, isHex, isString } from '~/modules/validators';

import hex2rgb from '~/converters/hex2rgb';
import { ColorModelKey, PlainObject } from '~/types';

export type ExtractColorPartsReturn = {
  alpha?: number;
  model: ColorModelKey;
} & PlainObject<number>;

/**
 * Extract the color parts from a CSS color string.
 * Hex colors are not supported.
 */
export default function extractColorParts(input: string) {
  invariant(isString(input), MESSAGES.inputString);

  if (isHex(input)) {
    const keys = COLOR_KEYS.rgb;
    const { r, g, b } = hex2rgb(input);
    const alpha = extractAlphaFromHex(input);

    return {
      model: 'rgb' as ColorModelKey,
      [keys[0]]: r,
      [keys[1]]: g,
      [keys[2]]: b,
      alpha: alpha < 1 ? alpha : undefined,
    } as ExtractColorPartsReturn;
  }

  const colorRegex =
    /(?:(rgb|hsl|oklab|oklch)a?\s*\(\s*([\d%.-]+)\s*[ ,/]\s*([\d%.-]+)\s*[ ,/]\s*([\d%.-]+)(?:\s*[ ,/]\s*([\d%.-]+))?\s*\))/i;

  const matches = colorRegex.exec(input);

  invariant(hasValidMatches(matches), MESSAGES.invalidCSS);

  const model = matches[1] as ColorModelKey;
  const keys = COLOR_KEYS[model];
  let alpha = matches[5] ? parseFloat(matches[5]) : 1;

  if (alpha > 1) {
    alpha /= 100;
  }

  return {
    model,
    [keys[0]]: parseFloat(matches[2]),
    [keys[1]]: parseFloat(matches[3]),
    [keys[2]]: parseFloat(matches[4]),
    alpha: alpha < 1 ? alpha : undefined,
  } as ExtractColorPartsReturn;
}
