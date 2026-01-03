import getColorType from '~/get-color-type';

import { ColorTypeInput } from '~/types';

/**
 * Check if a string is a valid CSS color.
 * Optionally validate against a specific color type.
 *
 * @param input - The color string to validate.
 * @param type - Optional color type to check against.
 * @returns True if the input is a valid color (of the specified type, if given).
 */
export default function isValidColor(input: string, type?: ColorTypeInput): boolean {
  const detectedType = getColorType(input);

  if (detectedType === null) {
    return false;
  }

  if (type === undefined) {
    return true;
  }

  return detectedType === type;
}
