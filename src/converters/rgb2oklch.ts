import { parseInput } from '~/modules/utils';

import oklab2oklch from '~/converters/oklab2oklch';
import rgb2oklab from '~/converters/rgb2oklab';
import { ConverterParameters, LCH, RGB } from '~/types';

/** Convert RGB to oklch */
export default function rgb2oklch(input: ConverterParameters<RGB>, precision?: number): LCH {
  const value = parseInput(input, 'rgb');

  return oklab2oklch(rgb2oklab(value, precision), precision);
}
