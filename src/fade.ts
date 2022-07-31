import hex2hsl from './hex2hsl';
import hex2rgb from './hex2rgb';
import { invariant, isNumber, isString, messages } from './modules/utils';
import parseCSS from './parse-css';
import { ColorTypes } from './types';

/**
 * Fade the color
 */
export default function fade(input: string, amount = 10, output: ColorTypes = 'rgb'): string {
  invariant(isString(input), messages.inputString);
  invariant(isNumber(amount), messages.amount);

  const hex = parseCSS(input);
  const percentage = (100 - amount) / 100;

  if (output === 'rgb') {
    const { r, g, b } = hex2rgb(hex);

    return `rgba(${r}, ${g}, ${b}, ${percentage})`;
  }

  if (output === 'hsl') {
    const { h, s, l } = hex2hsl(hex);

    return `hsla(${h}, ${s}%, ${l}%, ${percentage})`;
  }

  return `${hex}${Math.round(percentage * 255).toString(16)}`;
}
