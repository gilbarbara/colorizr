import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { isNumberInRange, isString } from '~/modules/validators';

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

  const parsed = resolveColor(input);
  const output = format ?? parsed.type;

  return formatCSS(parsed.rgb, { format: output, alpha });
}
