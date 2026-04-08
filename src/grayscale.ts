import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { isString } from '~/modules/validators';

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

  const parsed = resolveColor(input);
  const lch = parsed.oklch;
  const output = format ?? parsed.type;

  return formatCSS(
    { ...lch, c: 0 },
    { format: output, alpha: parsed.alpha < 1 ? parsed.alpha : undefined },
  );
}
