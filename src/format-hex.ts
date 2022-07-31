import isValidHex from './is-valid-hex';
import { invariant, isString, messages } from './modules/utils';

export default function formatHex(input: string): string {
  invariant(isString(input), messages.inputString);

  const color = input.replace('#', '');
  let hex = color;

  if (color.length === 3 || color.length === 4) {
    hex = '';

    [...color].forEach(d => {
      hex += d + d;
    });
  }

  hex = `#${hex}`;

  invariant(isValidHex(hex), 'invalid hex');

  return hex;
}
