import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

import { ColorType } from '~/types';

/**
 * Convert a color to grayscale using OkLCH (perceptually uniform).
 * Sets chroma to 0 while preserving lightness.
 *
 * @param input - The input color string.
 * @param format - The output color format.
 * @returns The grayscale color string.
 */
export default function grayscale(input: string, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);

  const output = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;
  const lch = parseCSS(input, 'oklch');

  return formatCSS({ ...lch, c: 0 }, { format: format ?? output, alpha: lch.alpha });
}
