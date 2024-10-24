import formatCSS from '~/format-css';
import { ColorType } from '~/types';

/**
 * Generate a random color.
 */
export default function random(type: ColorType = 'hex'): string {
  const hsl = {
    h: Math.floor(Math.random() * 360) + 1,
    s: Math.floor(Math.random() * 90) + 10,
    l: Math.floor(Math.random() * 80) + 10,
  };

  return formatCSS(hsl, { format: type });
}
