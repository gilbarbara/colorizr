import { oklch2oklab, rgb2oklab } from '~/converters';
import { DELTA_E_JND } from '~/delta-e';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { srgbGammaEncode } from '~/modules/gamma';
import { invariant } from '~/modules/invariant';
import { isInGamut, oklabToLinearSRGB } from '~/modules/linear-rgb';
import { resolveColor } from '~/modules/parsed-color';
import { clamp } from '~/modules/utils';
import { isString } from '~/modules/validators';

import { ColorType, LAB, LCH, RGB } from '~/types';

// Chroma search precision of the CSS Color 4 algorithm
const CHROMA_EPSILON = 0.0001;

/** Clip each channel of the color to the sRGB range. */
function clip(lch: LCH): RGB {
  const [r, g, b] = toLinearSRGB(lch).map(channel => clamp(srgbGammaEncode(channel), 0, 1) * 255);

  return { r, g, b };
}

function deltaEOK(left: LAB, right: LAB): number {
  return Math.sqrt((left.l - right.l) ** 2 + (left.a - right.a) ** 2 + (left.b - right.b) ** 2);
}

function toLinearSRGB(lch: LCH) {
  const { l, a, b } = oklch2oklab(lch, 16);

  return oklabToLinearSRGB(l, a, b);
}

/**
 * Map a color into the sRGB gamut with the CSS Color 4 gamut mapping algorithm:
 * reduce chroma in OkLCH until clipping the color changes it by less than
 * a just noticeable difference (Delta E OK 0.02), then clip it.
 * Colors already in gamut are returned unchanged.
 *
 * @param input - The input color string.
 * @param format - Optional output color format.
 * @returns The gamut-mapped color string.
 */
export default function toGamut(input: string, format?: ColorType): string {
  invariant(isString(input), MESSAGES.inputString);

  const parsed = resolveColor(input);
  const lch = parsed.oklch;
  const output = format ?? parsed.type;
  const alpha = parsed.alpha < 1 ? parsed.alpha : undefined;

  // Edge cases: extreme lightness
  if (lch.l <= 0) {
    return formatCSS({ r: 0, g: 0, b: 0 }, { format: output, alpha });
  }

  if (lch.l >= 1) {
    return formatCSS({ r: 255, g: 255, b: 255 }, { format: output, alpha });
  }

  // Already in gamut?
  if (isInGamut(toLinearSRGB(lch))) {
    return formatCSS(lch, { format: output, alpha });
  }

  const current = { ...lch };
  let clipped = clip(current);
  let delta = deltaEOK(rgb2oklab(clipped), oklch2oklab(current, 16));

  // Clipping alone is close enough
  if (delta < DELTA_E_JND) {
    return formatCSS(clipped, { format: output, alpha });
  }

  // Binary search on chroma for the color whose clipped version is just under the JND
  let min = 0;
  let max = lch.c;
  let minInGamut = true;

  while (max - min > CHROMA_EPSILON) {
    current.c = (min + max) / 2;

    if (minInGamut && isInGamut(toLinearSRGB(current))) {
      min = current.c;
    } else {
      clipped = clip(current);
      delta = deltaEOK(rgb2oklab(clipped), oklch2oklab(current, 16));

      if (delta < DELTA_E_JND) {
        if (DELTA_E_JND - delta < CHROMA_EPSILON) {
          break;
        }

        minInGamut = false;
        min = current.c;
      } else {
        max = current.c;
      }
    }
  }

  return formatCSS(clipped, { format: output, alpha });
}
