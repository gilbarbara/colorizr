import oklch2rgb from '~/converters/oklch2rgb';
import rgb2hsl from '~/converters/rgb2hsl';
import { addAlpha, extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HSL, LCH } from '~/types';

/**
 * Convert OkLCH to HSL.
 *
 * @param input - The OkLCH color object or tuple.
 * @returns The HSL color object.
 */
export default function oklch2hsl(input: ConverterParameters<LCH>): HSL {
  const value = parseInput(input, 'oklch');
  const alpha = extractAlpha(input);

  return addAlpha(rgb2hsl(oklch2rgb(value)), alpha);
}
