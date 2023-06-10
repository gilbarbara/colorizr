import hex2rgb from './hex2rgb';
import rgb2hsl from './rgb2hsl';

import { invariant, isString, MESSAGES } from '../modules/utils';
import { HSL } from '../types';

export default function hex2hsl(input: string): HSL {
  invariant(isString(input), MESSAGES.inputString);

  return rgb2hsl(hex2rgb(input));
}
