import { addAlpha, extractAlpha } from '~/modules/alpha';
import { CLMS_TO_OKLAB, LRGB_TO_LMS } from '~/modules/constants';
import { srgbGammaDecode } from '~/modules/gamma';
import { parseInput, restrictValues } from '~/modules/utils';

import { ConverterParameters, LAB, RGB } from '~/types';

const { cbrt } = Math;

/**
 * Convert RGB to OkLab.
 *
 * @param input - The RGB color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLab color object.
 */
export default function rgb2oklab(input: ConverterParameters<RGB>, precision?: number): LAB {
  const value = parseInput(input, 'rgb');
  const alpha = extractAlpha(input);

  const [lr, lg, lb] = [
    srgbGammaDecode(value.r / 255),
    srgbGammaDecode(value.g / 255),
    srgbGammaDecode(value.b / 255),
  ];
  const l = cbrt(LRGB_TO_LMS[0][0] * lr + LRGB_TO_LMS[0][1] * lg + LRGB_TO_LMS[0][2] * lb);
  const m = cbrt(LRGB_TO_LMS[1][0] * lr + LRGB_TO_LMS[1][1] * lg + LRGB_TO_LMS[1][2] * lb);
  const s = cbrt(LRGB_TO_LMS[2][0] * lr + LRGB_TO_LMS[2][1] * lg + LRGB_TO_LMS[2][2] * lb);

  const lab = restrictValues(
    {
      l: CLMS_TO_OKLAB[0][0] * l + CLMS_TO_OKLAB[0][1] * m + CLMS_TO_OKLAB[0][2] * s,
      a: CLMS_TO_OKLAB[1][0] * l + CLMS_TO_OKLAB[1][1] * m + CLMS_TO_OKLAB[1][2] * s,
      b: CLMS_TO_OKLAB[2][0] * l + CLMS_TO_OKLAB[2][1] * m + CLMS_TO_OKLAB[2][2] * s,
    },
    precision,
  );

  return addAlpha(lab, alpha);
}
