import { addAlpha, extractAlpha } from '~/modules/alpha';
import { LMS_TO_LRGB, OKLAB_TO_CLMS } from '~/modules/constants';
import { srgbGammaEncode } from '~/modules/gamma';
import { clamp, parseInput, round } from '~/modules/utils';

import { ConverterParameters, LAB, RGB } from '~/types';

/**
 * Convert OkLab to RGB.
 *
 * @param input - The OkLab color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The RGB color object.
 */
export default function oklab2rgb(input: ConverterParameters<LAB>, precision = 0): RGB {
  const { l: L, a: A, b: B } = parseInput(input, 'oklab');
  const alpha = extractAlpha(input);

  const l = (OKLAB_TO_CLMS[0][0] * L + OKLAB_TO_CLMS[0][1] * A + OKLAB_TO_CLMS[0][2] * B) ** 3;
  const m = (OKLAB_TO_CLMS[1][0] * L + OKLAB_TO_CLMS[1][1] * A + OKLAB_TO_CLMS[1][2] * B) ** 3;
  const s = (OKLAB_TO_CLMS[2][0] * L + OKLAB_TO_CLMS[2][1] * A + OKLAB_TO_CLMS[2][2] * B) ** 3;

  const r =
    255 * srgbGammaEncode(LMS_TO_LRGB[0][0] * l + LMS_TO_LRGB[0][1] * m + LMS_TO_LRGB[0][2] * s);
  const g =
    255 * srgbGammaEncode(LMS_TO_LRGB[1][0] * l + LMS_TO_LRGB[1][1] * m + LMS_TO_LRGB[1][2] * s);
  const b =
    255 * srgbGammaEncode(LMS_TO_LRGB[2][0] * l + LMS_TO_LRGB[2][1] * m + LMS_TO_LRGB[2][2] * s);

  return addAlpha(
    {
      r: clamp(round(r, precision), 0, 255),
      g: clamp(round(g, precision), 0, 255),
      b: clamp(round(b, precision), 0, 255),
    },
    alpha,
  );
}
