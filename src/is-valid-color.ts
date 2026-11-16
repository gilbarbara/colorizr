import { ColorString, parseColorString } from '~/modules/color-string';

import { ColorTypeInput } from '~/types';

/**
 * Check if a string is a valid CSS color: CSS Color 4 syntax, and every value within
 * its range as written (the same ranges as the isRGB, isHSL, isLAB, and isLCH type guards).
 * Optionally validate against a specific color type.
 *
 * @param input - The color string to validate.
 * @param type - Optional color type to check against.
 * @returns True if the input is a valid color (of the specified type, if given).
 */
export default function isValidColor(input: string, type?: ColorTypeInput): boolean {
  let result: ColorString;

  try {
    result = parseColorString(input);
  } catch {
    return false;
  }

  if ('inRange' in result && (!result.strictSyntax || !result.inRange)) {
    return false;
  }

  return type === undefined || result.type === type;
}
