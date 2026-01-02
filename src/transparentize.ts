import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { clamp, round } from '~/modules/utils';
import { isNumberInRange, isString } from '~/modules/validators';
import opacity from '~/opacity';
import parseCSS from '~/parse-css';

import { Alpha, ColorType } from '~/types';

/**
 * Increase the color transparency.
 */
export default function transparentize(input: string, alpha: Alpha, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isNumberInRange(alpha, -1, 1), MESSAGES.alphaAdjustment);

  const oklch = parseCSS(input, 'oklab');

  const value = round(clamp(opacity(input) - alpha, 0, 1));

  return formatCSS(oklch, { format, alpha: value });
}
