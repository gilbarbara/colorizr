import hsl2rgb from './hsl2rgb';
import rgb2hex from './rgb2hex';

import { invariant, isHSL, MESSAGES } from '../modules/utils';
import { HSL } from '../types';

/**
 * Convert a HSL object to HEX.
 */
export default function hsl2hex(input: HSL): string {
  invariant(isHSL(input), MESSAGES.invalid);

  return rgb2hex(hsl2rgb(input));
}
