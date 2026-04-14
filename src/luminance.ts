import { MESSAGES } from '~/modules/constants';
import { srgbGammaDecode } from '~/modules/gamma';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { round } from '~/modules/utils';
import { isString } from '~/modules/validators';

/**
 * Get the relative luminance of a color (WCAG definition).
 *
 * @param input - The input color string.
 * @returns The luminance value (0-1).
 */
export default function luminance(input: string): number {
  invariant(isString(input), MESSAGES.inputString);

  const { r, g, b } = resolveColor(input).rgb;

  const lr = srgbGammaDecode(r / 255);
  const lg = srgbGammaDecode(g / 255);
  const lb = srgbGammaDecode(b / 255);

  return round(0.2126 * lr + 0.7152 * lg + 0.0722 * lb, 4);
}
