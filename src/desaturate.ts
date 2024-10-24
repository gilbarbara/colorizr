import updater from '~/modules/updater';

import { Amount, ColorType } from '~/types';

/**
 * Decrease color saturation
 */
export default function desaturate(input: string, amount: Amount, format?: ColorType) {
  return updater('s', '-', format)(input, amount);
}
