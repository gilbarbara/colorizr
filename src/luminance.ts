import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isString } from '~/modules/validators';

import parseCSS from '~/parse-css';

/**
 * Get the luminance of a color.
 */
export default function luminance(input: string): number {
  invariant(isString(input), MESSAGES.inputString);

  const { r, g, b } = parseCSS(input, 'rgb');

  const rgb = [r / 255, g / 255, b / 255];

  for (let index = 0; index < rgb.length; index++) {
    if (rgb[index] <= 0.03928) {
      rgb[index] /= 12.92;
    } else {
      rgb[index] = ((rgb[index] + 0.055) / 1.055) ** 2.4;
    }
  }

  return round(0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2], 4);
}
