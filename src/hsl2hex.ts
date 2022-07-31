import hsl2rgb from './hsl2rgb';
import { invariant, isHSL, messages } from './modules/utils';
import rgb2hex from './rgb2hex';
import { HSL } from './types';

/**
 * Convert a HSL object to HEX.
 */
export default function hsl2hex(input: HSL): string {
  invariant(isHSL(input), messages.invalid);

  return rgb2hex(hsl2rgb(input));
}
