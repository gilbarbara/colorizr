import { cssColors } from './modules/css-colors';
import { invariant, isString, messages } from './modules/utils';
import parseCSS from './parse-css';

export default function name(input: string): string {
  invariant(isString(input), messages.inputString);

  const hex = parseCSS(input);

  const [color] = Object.entries(cssColors).find(([, value]) => value === hex) || [];

  return color || hex;
}
