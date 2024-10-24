import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isNumber, isString } from '~/modules/validators';

import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import parseCSS from '~/parse-css';
import { Alpha, ColorType } from '~/types';

/**
 * Make the color transparent
 */
export default function opacify(input: string, alpha: Alpha, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isNumber(alpha), MESSAGES.alpha);
  const type = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;

  const rgb = parseCSS(input, 'rgb');

  return formatCSS(rgb, { format: format ?? type, alpha });
}
