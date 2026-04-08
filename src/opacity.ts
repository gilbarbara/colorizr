import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { isString } from '~/modules/validators';

/**
 * Get the opacity/alpha value of a color.
 *
 * @param input - The input color string.
 * @returns The opacity value (0-1).
 */
export default function opacity(input: string): number {
  invariant(isString(input), MESSAGES.inputString);

  return resolveColor(input).alpha;
}
