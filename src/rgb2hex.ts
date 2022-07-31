import { invariant, isRGB, isRGBArray, messages } from './modules/utils';
import { RGB, RGBArray } from './types';

/**
 * Convert an RGA object to hex.
 */
export default function rgb2hex(input: RGB | RGBArray): string {
  invariant(!!input, messages.input);
  invariant(isRGBArray(input) || isRGB(input), messages.invalid);

  let r: number;
  let g: number;
  let b: number;

  if (isRGBArray(input)) {
    [r, g, b] = input;
  } else {
    ({ r, g, b } = input);
  }

  const output = [r.toString(16), g.toString(16), b.toString(16)];

  return `#${output.map(d => (d.length === 1 ? `0${d}` : d)).join('')}`;
}
