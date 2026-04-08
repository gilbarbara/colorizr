import formatCSS from '~/format-css';
import { resolveColor } from '~/modules/parsed-color';

import { ColorType } from '~/types';

/**
 * Convert a color string to another format.
 *
 * @param input - The input color string.
 * @param format - The output color format.
 * @returns The converted color string.
 */
export default function convert(input: string, format: ColorType): string {
  const parsed = resolveColor(input);

  return formatCSS(parsed[format], { format, alpha: parsed.alpha < 1 ? parsed.alpha : undefined });
}
