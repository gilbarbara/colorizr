import hex2rgb from './converters/hex2rgb';
import { invariant, isString, MESSAGES, round } from './modules/utils';
import parseCSS from './parse-css';

/**
 * Get the chroma of a color.
 */
export default function chroma(input: string): number {
  invariant(isString(input), MESSAGES.inputString);

  const { r, g, b } = hex2rgb(parseCSS(input));

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  return round((max - min) / 255, 4);
}
