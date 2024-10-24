import updater from '~/modules/updater';

import { Amount, ColorType } from '~/types';

/**
 * Decrease color lightness
 */
export default function darken(input: string, amount: Amount, format?: ColorType): string {
  return updater('l', '-', format)(input, amount);
}
