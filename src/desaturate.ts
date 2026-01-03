import updater from '~/modules/updater';

import { ColorType } from '~/types';

/**
 * Decrease color saturation.
 *
 * @param input - The input color string.
 * @param amount - A number between 0 and 100.
 * @param format - The output color format.
 * @returns The desaturated color string.
 */
export default function desaturate(input: string, amount: number, format?: ColorType): string {
  return updater('s', '-', format)(input, amount);
}
