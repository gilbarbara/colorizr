import { MESSAGES } from '~/modules/constants';
import { cssColors } from '~/modules/css-colors';
import { invariant } from '~/modules/invariant';
import { isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

/**
 * Get the CSS color name of a color.
 * Returns the hex value if no matching name is found.
 *
 * @param input - The input color string.
 * @returns The CSS color name or hex value.
 */
export default function name(input: string): string {
  invariant(isString(input), MESSAGES.inputString);

  const hex = parseCSS(input, 'hex');

  const [color] = Object.entries(cssColors).find(([, value]) => value === hex) || [];

  return color ?? hex;
}
