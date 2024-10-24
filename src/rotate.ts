import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { constrainDegrees } from '~/modules/utils';
import { isHex, isNamedColor, isNumber, isString } from '~/modules/validators';

import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import parseCSS from '~/parse-css';
import { ColorType, Degrees } from '~/types';

/**
 * Change the color hue
 */
export default function rotate(input: string, degrees: Degrees, format?: ColorType) {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isNumber(degrees), 'degrees must be a number');

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
