import hex2hsl from './hex2hsl';
import parseCSS from './parse-css';
import { shift } from './shift';
import { constrainDegrees, invariant, isNumber, isString, messages } from './utils';

/**
 * Change the color hue
 */
export default function rotate(input: string, degrees = 15): string {
  invariant(!isString(input), messages.inputString);
  invariant(!isNumber(degrees), 'degrees must be a number');

  const hex = parseCSS(input);
  const { h } = hex2hsl(hex);

  return shift(hex, {
    h: constrainDegrees(h, degrees),
  });
}
