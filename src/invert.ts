import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isString } from '~/modules/validators';

import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import parseCSS from '~/parse-css';
import rotate from '~/rotate';
import { HEX } from '~/types';

/**
 * Invert the color
 */
export default function invert(input: string) {
  invariant(isString(input), MESSAGES.inputString);
  const format = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;
  const hex = parseCSS(input, 'hex');

  return formatCSS(rotate(hex, 180) as HEX, { format });
}
