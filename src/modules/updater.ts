import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { clamp } from '~/modules/utils';
import { isHex, isNamedColor, isNumber, isString } from '~/modules/validators';

import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import parseCSS from '~/parse-css';
import { ColorModelKeys, ColorType } from '~/types';

/**
 * Update color properties
 */
export default function updater(
  key: ColorModelKeys<'hsl'>,
  operator: '+' | '-',
  format?: ColorType,
) {
  return (input: string, amount: number) => {
    invariant(isString(input), MESSAGES.inputString);
    invariant(isNumber(amount), MESSAGES.alpha);

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
