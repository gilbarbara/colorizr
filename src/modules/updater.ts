import { constrain, invariant, isNumber, isString, MESSAGES } from './utils';

import hex2hsl from '../converters/hex2hsl';
import parseCSS from '../parse-css';
import { shift } from '../shift';

/**
 * Update color properties
 */
export default function updater(type: 'h' | 's' | 'l', sign: '+' | '-') {
  return (input: string, amount: number) => {
    invariant(isString(input), MESSAGES.inputString);
    invariant(isNumber(amount), MESSAGES.amount);

    const hex = parseCSS(input);
    const hsl = hex2hsl(hex);

    return shift(hex, {
      [type]: constrain(hsl[type], amount, [0, 100], sign),
    });
  };
}
