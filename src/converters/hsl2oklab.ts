import { parseInput } from '~/modules/utils';

import hsl2rgb from '~/converters/hsl2rgb';
import rgb2oklab from '~/converters/rgb2oklab';
import { ConverterParameters, HSL, LAB } from '~/types';

/** Convert HSL to oklab */
export default function hsl2oklab(input: ConverterParameters<HSL>, precision?: number): LAB {
  const value = parseInput(input, 'hsl');

  return rgb2oklab(hsl2rgb(value), precision);
}
