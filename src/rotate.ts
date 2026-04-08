import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { constrainDegrees } from '~/modules/utils';
import { isNumberInRange, isString } from '~/modules/validators';

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

  const parsed = resolveColor(input);
  const color = parsed.hsl;
  const output = format ?? parsed.type;

  return formatCSS(
    {
      ...color,
      h: constrainDegrees(color.h, degrees),
    },
    { format: output, alpha: parsed.alpha < 1 ? parsed.alpha : undefined },
  );
}
