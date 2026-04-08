import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isString } from '~/modules/validators';
import rotate from '~/rotate';

/**
 * Invert the color by rotating hue 180 degrees.
 *
 * @param input - The input color string.
 * @returns The inverted color string in the same format as input.
 */
export default function invert(input: string): string {
  invariant(isString(input), MESSAGES.inputString);

  return rotate(input, 180);
}
