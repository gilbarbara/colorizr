import oklch2rgb from '~/converters/oklch2rgb';
import rgb2hex from '~/converters/rgb2hex';
import { addAlphaToHex } from '~/modules/hex-utils';
import { extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HEX, LCH } from '~/types';

/** Convert oklch to HEX */
export default function oklch2hex(input: ConverterParameters<LCH>): HEX {
  const value = parseInput(input, 'oklch');
  const alpha = extractAlpha(input);

  const hex = rgb2hex(oklch2rgb(value));

  return alpha !== undefined && alpha < 1 ? addAlphaToHex(hex, alpha) : hex;
}
