import formatCSS from '~/format-css';
import parseCSS from '~/parse-css';

import { ColorType } from '~/types';

/**
 * Convert a color string to another format.
 *
 * @param input - The input color string.
 * @param format - The output color format.
 * @returns The converted color string.
 */
export default function convert(input: string, format: ColorType): string {
  const value = parseCSS(input, format);

  return formatCSS(value, { format });
}
