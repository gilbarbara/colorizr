import updater from '~/modules/updater';

import { ColorType } from '~/types';

/**
 * Increase color lightness.
 *
 * @param input - The input color string.
 * @param amount - A number between 0 and 100.
 * @param format - The output color format.
 * @returns The lightened color string.
 */
export default function lighten(input: string, amount: number, format?: ColorType): string {
  return updater('l', '+', format)(input, amount);
}
