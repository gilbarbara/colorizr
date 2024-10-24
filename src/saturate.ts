import updater from '~/modules/updater';

import { ColorType } from '~/types';

/**
 * Increase color saturation
 */
export default function saturate(input: string, amount: number, format?: ColorType) {
  return updater('s', '+', format)(input, amount);
}
