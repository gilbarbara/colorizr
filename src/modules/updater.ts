import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { clamp } from '~/modules/utils';
import { isHex, isNamedColor, isNumberInRange, isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

import { ColorModelKeys, ColorType } from '~/types';

/**
 * Create a function to update HSL color properties.
 *
 * @param key - The HSL property to update ('h', 's', or 'l').
 * @param operator - The operation to perform ('+' or '-').
 * @param format - The output color format.
 * @returns A function that takes a color and amount, returning the updated color.
 */
export default function updater(
  key: ColorModelKeys<'hsl'>,
  operator: '+' | '-',
  format?: ColorType,
) {
  /**
   * @param input - The input color string.
   * @param amount - A number between 0 and 100.
   * @returns The updated color string.
   */
  return (input: string, amount: number) => {
    invariant(isString(input), MESSAGES.inputString);
    invariant(isNumberInRange(amount, 0, 100), MESSAGES.amount);

    const color = parseCSS(input, 'hsl');
    const output = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;

    return formatCSS(
      {
        ...color,
        [key]: clamp(color[key] + (operator === '+' ? amount : -amount), 0, 100),
      },
      { format: format ?? output },
    );
  };
}
