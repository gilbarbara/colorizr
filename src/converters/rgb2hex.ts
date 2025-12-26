import { addAlphaToHex } from '~/modules/hex-utils';
import { extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HEX, RGB } from '~/types';

/** Convert RGB to HEX */
export default function rgb2hex(input: ConverterParameters<RGB>): HEX {
  const rgb = parseInput(input, 'rgb');
  const alpha = extractAlpha(input);

  const hex = `#${[rgb.r, rgb.g, rgb.b]
    .map(d => `0${Math.floor(d).toString(16)}`.slice(-2))
    .join('')}` as HEX;

  return alpha !== undefined && alpha < 1 ? addAlphaToHex(hex, alpha) : hex;
}
