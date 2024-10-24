import { parseInput } from '~/modules/utils';

import hsl2rgb from '~/converters/hsl2rgb';
import rgb2oklch from '~/converters/rgb2oklch';
import { ConverterParameters, HSL, LCH } from '~/types';

/** Convert HSL to oklch */
export default function hsl2oklch(input: ConverterParameters<HSL>, precision?: number): LCH {
  const value = parseInput(input, 'hsl');

  return rgb2oklch(hsl2rgb(value), precision);
}
