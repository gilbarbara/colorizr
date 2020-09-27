import hex2rgb from './hex2rgb';
import rgb2hsl from './rgb2hsl';
import { invariant, isString, messages } from './utils';

import { HSL } from './types';

export default function hex2hsl(input: string): HSL {
  invariant(!isString(input), messages.inputString);

  return rgb2hsl(hex2rgb(input));
}
