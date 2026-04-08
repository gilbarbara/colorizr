import { oklch2oklab } from '~/converters';
import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isInSRGBGamut, oklabToLinearSRGB } from '~/modules/linear-rgb';
import { isHex, isNamedColor, isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

import { ColorType } from '~/types';

/**
 * Map a color into the sRGB gamut by reducing chroma in OkLCH space.
 * Colors already in gamut are returned unchanged.
 *
 * @param input - The input color string.
 * @param format - Optional output color format.
 * @returns The gamut-mapped color string.
 */
export default function toGamut(input: string, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);

  const lch = parseCSS(input, 'oklch');
  const output =
    format ?? (isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model);
  const { alpha } = lch;

  // Edge cases: extreme lightness
  if (lch.l <= 0) {
    return formatCSS({ r: 0, g: 0, b: 0 }, { format: output, alpha });
  }

  if (lch.l >= 1) {
    return formatCSS({ r: 255, g: 255, b: 255 }, { format: output, alpha });
  }

  // Already in gamut?
  const lab = oklch2oklab(lch, 16);

  if (isInSRGBGamut(oklabToLinearSRGB(lab.l, lab.a, lab.b))) {
    return formatCSS(lch, { format: output, alpha });
  }

  // Binary search: reduce chroma until in sRGB gamut
  const epsilon = 0.000001;
  let low = 0;
  let high = lch.c;

  while (high - low > epsilon) {
    const mid = (low + high) / 2;
    const midLab = oklch2oklab({ l: lch.l, c: mid, h: lch.h }, 16);

    if (isInSRGBGamut(oklabToLinearSRGB(midLab.l, midLab.a, midLab.b))) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return formatCSS({ l: lch.l, c: low, h: lch.h }, { format: output, alpha });
}
