import { parseColorString } from '~/modules/color-string';
import { isString } from '~/modules/validators';

import { ColorTypeInput } from '~/types';

/**
 * Detect the color type from a CSS color string.
 *
 * @param input - The color string to analyze.
 * @returns The detected color type ('hex', 'hsl', 'rgb', 'oklab', 'oklch', 'named'),
 *          or `null` if the input is not a valid color string.
 */
export default function getColorType(input: string): ColorTypeInput | null {
  if (!isString(input)) {
    return null;
  }

  try {
    return parseColorString(input).type;
  } catch {
    return null;
  }
}
