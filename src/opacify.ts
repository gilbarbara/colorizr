import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isNumberInRange, isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

import { ColorType } from '~/types';

/**
 * Set the color opacity/alpha.
 *
 * @param input - The input color string.
 * @param alpha - A number between 0 and 1.
 * @param format - The output color format.
 * @returns The opacified color string.
 */
export default function opacify(input: string, alpha: number, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isNumberInRange(alpha, 0, 1), MESSAGES.alpha);

  const type = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;
  const rgb = parseCSS(input, 'rgb');

  return formatCSS(rgb, { format: format ?? type, alpha });
}
