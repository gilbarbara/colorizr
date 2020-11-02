import hex2rgb from './hex2rgb';
import parseCSS from './parse-css';
import { invariant, isString, messages, round } from './utils';

/**
 * Get the luminance of a color.
 */
export default function luminance(input: string): number {
  invariant(!isString(input), messages.inputString);

  const { r, g, b } = hex2rgb(parseCSS(input));

  const rgb = [r / 255, g / 255, b / 255];

  for (let i = 0; i < rgb.length; i++) {
    if (rgb[i] <= 0.03928) {
      rgb[i] /= 12.92;
    } else {
      rgb[i] = ((rgb[i] + 0.055) / 1.055) ** 2.4;
    }
  }

  return round(0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2], 4);
}
