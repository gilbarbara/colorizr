import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isString } from '~/modules/validators';

import hex2rgb from '~/converters/hex2rgb';
import parseCSS from '~/parse-css';

export interface TextColorOptions {
  /**
   * The dark color to return if the input is light.
   * @default '#000000'
   */
  darkColor?: string;
  /**
   * The light color to return if the input is dark.
   * @default '#ffffff'
   */
  lightColor?: string;
  /**
   * The threshold to determine if the color is light or dark.
   *
   * A number between 0 and 255.
   * @default 128
   */
  threshold?: number;
}

/**
 * Get the contrasted color for a given hex.
 */
export default function textColor(input: string, options: TextColorOptions = {}): string {
  const { darkColor = '#000000', lightColor = '#ffffff', threshold = 128 } = options;

  invariant(isString(input), MESSAGES.inputString);
  invariant(threshold >= 0 && threshold <= 255, MESSAGES.threshold);

  try {
    const { r, g, b } = hex2rgb(parseCSS(input, 'hex'));
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= threshold ? darkColor : lightColor;
  } catch (error) {
    /* eslint-disable no-console */
    console.warn(`Invalid color input: ${input}`);
    console.warn(error);
    /* eslint-enable no-console */

    return darkColor; // Default to dark color in case of error
  }
}
