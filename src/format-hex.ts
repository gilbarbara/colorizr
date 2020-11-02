import { invariant, isString, messages } from './utils';
import isValidHex from './is-valid-hex';

export default function formatHex(input: string): string {
  invariant(!isString(input), messages.inputString);

  const color = input.replace('#', '');
  let hex = color;

  if (color.length === 3 || color.length === 4) {
    hex = '';

    color.split('').forEach(d => {
      hex += d + d;
    });
  }

  hex = `#${hex}`;

  invariant(!isValidHex(hex), 'invalid hex');

  return hex;
}
