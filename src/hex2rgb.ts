import formatHex from './format-hex';
import { invariant, isString, messages } from './modules/utils';
import { RGB } from './types';

export default function hex2rgb(input: string): RGB {
  invariant(isString(input), messages.inputString);

  const hex = formatHex(input).substr(1);

  return {
    r: parseInt(String(hex.charAt(0)) + hex.charAt(1), 16),
    g: parseInt(String(hex.charAt(2)) + hex.charAt(3), 16),
    b: parseInt(String(hex.charAt(4)) + hex.charAt(5), 16),
  };
}
