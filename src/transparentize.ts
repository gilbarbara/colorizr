import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { clamp, round } from '~/modules/utils';
import { isNumberInRange, isString } from '~/modules/validators';

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

  const parsed = resolveColor(input);
  const value = round(clamp(parsed.alpha - alpha, 0, 1));

  return formatCSS(parsed.oklch, { format: format ?? parsed.type, alpha: value });
}
