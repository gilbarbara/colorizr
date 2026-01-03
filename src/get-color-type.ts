import extractColorParts from '~/extract-color-parts';
import { isHex, isNamedColor, isString } from '~/modules/validators';

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

  if (isHex(input)) {
    return 'hex';
  }

  if (isNamedColor(input)) {
    return 'named';
  }

  try {
    const { model } = extractColorParts(input);

    return model;
  } catch {
    return null;
  }
}
