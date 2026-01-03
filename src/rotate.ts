import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { constrainDegrees } from '~/modules/utils';
import { isHex, isNamedColor, isNumberInRange, isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

import { ColorType } from '~/types';

/**
 * Change the color hue by rotating it.
 *
 * @param input - The input color string.
 * @param degrees - A number between -360 and 360.
 * @param format - The output color format.
 * @returns The rotated color string.
 */
export default function rotate(input: string, degrees: number, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isNumberInRange(degrees, -360, 360), MESSAGES.degreesRange);

  const color = parseCSS(input, 'hsl');

  const output = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;

  return formatCSS(
    {
      ...color,
      h: constrainDegrees(color.h, degrees),
    },
    { format: format ?? output },
  );
}
