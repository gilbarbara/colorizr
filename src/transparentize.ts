import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { clamp, round } from '~/modules/utils';
import { isNumberInRange, isString } from '~/modules/validators';
import opacity from '~/opacity';
import parseCSS from '~/parse-css';

import { ColorType } from '~/types';

/**
 * Increase the color transparency.
 *
 * @param input - The input color string.
 * @param alpha - A number between -1 and 1. Positive values increase transparency, negative values decrease transparency.
 * @param format - The output color format.
 * @returns The transparentized color string.
 */
export default function transparentize(input: string, alpha: number, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isNumberInRange(alpha, -1, 1), MESSAGES.alphaAdjustment);

  const oklch = parseCSS(input, 'oklab');

  const value = round(clamp(opacity(input) - alpha, 0, 1));

  return formatCSS(oklch, { format, alpha: value });
}
