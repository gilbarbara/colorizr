import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex } from '~/modules/validators';

import { HEX } from '~/types';

/**
 * Normalize a hex color string to 6 or 8 characters.
 *
 * @param input - The hex color string (3, 4, 6, or 8 characters).
 * @returns The normalized hex color string.
 */
export default function formatHex(input: string): HEX {
  invariant(isHex(input), MESSAGES.inputHex);

  let color = input.replace('#', '');

  if (color.length === 3 || color.length === 4) {
    const values = [...color];

    color = '';

    values.forEach(d => {
      color += `${d}${d}`;
    });
  }

  const hex = `#${color}`;

  invariant(isHex(hex), MESSAGES.invalidHex);

  return hex;
}
