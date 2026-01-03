import updater from '~/modules/updater';

import { ColorType } from '~/types';

/**
 * Increase color saturation.
 *
 * @param input - The input color string.
 * @param amount - A number between 0 and 100.
 * @param format - The output color format.
 * @returns The saturated color string.
 */
export default function saturate(input: string, amount: number, format?: ColorType): string {
  return updater('s', '+', format)(input, amount);
}
