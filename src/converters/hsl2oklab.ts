import hsl2rgb from '~/converters/hsl2rgb';
import rgb2oklab from '~/converters/rgb2oklab';
import { addAlpha, extractAlpha, parseInput } from '~/modules/utils';

import { ConverterParameters, HSL, LAB } from '~/types';

/** Convert HSL to oklab */
export default function hsl2oklab(input: ConverterParameters<HSL>, precision?: number): LAB {
  const value = parseInput(input, 'hsl');
  const alpha = extractAlpha(input);

  return addAlpha(rgb2oklab(hsl2rgb(value), precision), alpha);
}
