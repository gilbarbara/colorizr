import { MESSAGES } from '~/modules/constants';
import { cssColors } from '~/modules/css-colors';
import { invariant } from '~/modules/invariant';
import { isString } from '~/modules/validators';

import parseCSS from '~/parse-css';

/**
 * Get the name of a color.
 * Returns the hex value if the color is not found.
 */
export default function name(input: string): string {
  invariant(isString(input), MESSAGES.inputString);

  const hex = parseCSS(input, 'hex');

  const [color] = Object.entries(cssColors).find(([, value]) => value === hex) || [];

  return color ?? hex;
}
