import formatCSS from '~/format-css';
import parseCSS from '~/parse-css';
import { ColorType } from '~/types';

/**
 * Convert a color string to another format.
 */
export default function convert(input: string, format: ColorType) {
  const value = parseCSS(input, format);

  return formatCSS(value, { format });
}
