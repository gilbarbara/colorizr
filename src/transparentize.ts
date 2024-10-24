import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { clamp, round } from '~/modules/utils';
import { isNumber, isString } from '~/modules/validators';

import formatCSS from '~/format-css';
import opacity from '~/opacity';
import parseCSS from '~/parse-css';
import { Alpha, ColorType } from '~/types';

/**
 * Increase the color transparency.
 */
export default function transparentize(input: string, alpha: Alpha, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isNumber(alpha), MESSAGES.alpha);

  invariant(alpha >= -1 && alpha <= 1, MESSAGES.alpha);

  const oklch = parseCSS(input, 'oklab');

  const value = round(clamp(opacity(input) - alpha, 0, 1));

  return formatCSS(oklch, { format, alpha: value });
}
