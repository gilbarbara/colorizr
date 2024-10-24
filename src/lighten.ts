import updater from '~/modules/updater';

import { Amount, ColorType } from '~/types';

/**
 * Increase color lightness
 */
export default function lighten(input: string, amount: Amount, format?: ColorType) {
  return updater('l', '+', format)(input, amount);
}
