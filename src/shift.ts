import hex2hsl from './converters/hex2hsl';
import hsl2hex from './converters/hsl2hex';
import { HSLKeys, invariant, isPlainObject, isString, MESSAGES, pick } from './modules/utils';
import parseCSS from './parse-css';
import { HSL, RGB } from './types';

/**
 * Shift color properties
 */
export function shift(input: string, options: Partial<HSL | RGB>): string {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isPlainObject(options), MESSAGES.options);

  return hsl2hex({ ...hex2hsl(parseCSS(input)), ...pick(options, HSLKeys) });
}
