import hex2rgb from './hex2rgb';
import parseCSS from './parse-css';
import { invariant, isString, messages } from './utils';

/**
 * Get the contrasted color for a given hex.
 */
export default function textColor(input: string): string {
  invariant(!isString(input), messages.inputString);

  const { r, g, b } = hex2rgb(parseCSS(input));
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? '#000000' : '#ffffff';
}
