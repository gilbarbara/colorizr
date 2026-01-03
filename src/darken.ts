import updater from '~/modules/updater';

import { ColorType } from '~/types';

/**
 * Decrease color lightness.
 *
 * @param input - The input color string.
 * @param amount - A number between 0 and 100.
 * @param format - The output color format.
 * @returns The darkened color string.
 */
export default function darken(input: string, amount: number, format?: ColorType): string {
  return updater('l', '-', format)(input, amount);
}
