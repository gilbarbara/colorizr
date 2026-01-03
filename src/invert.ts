import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isString } from '~/modules/validators';
import parseCSS from '~/parse-css';
import rotate from '~/rotate';

import { HEX } from '~/types';

/**
 * Invert the color by rotating hue 180 degrees.
 *
 * @param input - The input color string.
 * @returns The inverted color string in the same format as input.
 */
export default function invert(input: string): string {
  invariant(isString(input), MESSAGES.inputString);
  const format = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;
  const hex = parseCSS(input, 'hex');

  return formatCSS(rotate(hex, 180) as HEX, { format });
}
