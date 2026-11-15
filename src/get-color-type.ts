import { parseColorString } from '~/modules/color-string';
import { isString } from '~/modules/validators';

import { ColorTypeInput } from '~/types';

/**
 * Detect the color type from a CSS color string.
 * Detection is syntax-only: out-of-range values still return their type (use isValidColor to check them).
 *
 * @param input - The color string to analyze.
 * @returns The detected color type ('hex', 'hsl', 'rgb', 'oklab', 'oklch', 'named'),
 *          or `null` if the input can't be parsed.
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
