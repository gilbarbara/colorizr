import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex } from '~/modules/validators';

import { HEX } from '~/types';

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

  invariant(isHex(hex), 'invalid hex');

  return hex;
}
