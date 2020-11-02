import hsl2hex from './hsl2hex';
import hex2hsl from './hex2hsl';
import parseCSS from './parse-css';
import { HSLKeys, invariant, isPlainObject, isString, messages, pick } from './utils';

import { HSL, RGB } from './types';

/**
 * Shift color properties
 */
export function shift(input: string, options: Partial<HSL | RGB>): string {
  invariant(!isString(input), messages.inputString);
  invariant(!isPlainObject(options), messages.options);

  return hsl2hex({ ...hex2hsl(parseCSS(input)), ...pick(options, HSLKeys) });
}
