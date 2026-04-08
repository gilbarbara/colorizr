import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { type ColorInput, isParsedColor, resolveColor } from '~/modules/parsed-color';
import { clamp } from '~/modules/utils';
import { isNumberInRange, isString } from '~/modules/validators';

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
   * @param input - The input color string or ParsedColor.
   * @param amount - A number between 0 and 100.
   * @returns The updated color string.
   */
  return (input: ColorInput, amount: number) => {
    invariant(isString(input) || isParsedColor(input), MESSAGES.inputString);
    invariant(isNumberInRange(amount, 0, 100), MESSAGES.amount);

    const parsed = resolveColor(input);
    const { hsl } = parsed;
    const output = format ?? parsed.type;

    return formatCSS(
      {
        ...hsl,
        [key]: clamp(hsl[key] + (operator === '+' ? amount : -amount), 0, 100),
      },
      { format: output, alpha: parsed.alpha < 1 ? parsed.alpha : undefined },
    );
  };
}
