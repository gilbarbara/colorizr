import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isNumberInRange, isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

import { ColorType } from '~/types';

/**
 * Interpolate hue using shortest path around the color wheel.
 * Handles achromatic colors (chroma ≈ 0) by using the other color's hue.
 */
function interpolateHue(h1: number, h2: number, c1: number, c2: number, ratio: number): number {
  // If first color is achromatic, use second color's hue
  if (c1 < 0.0001) {
    return h2;
  }

  // If second color is achromatic, use first color's hue
  if (c2 < 0.0001) {
    return h1;
  }

  let diff = h2 - h1;

  // Take shortest path around the color wheel
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }

  let result = h1 + diff * ratio;

  // Normalize to 0-360
  if (result < 0) {
    result += 360;
  } else if (result >= 360) {
    result -= 360;
  }

  return result;
}

/**
 * Mix two colors in OkLCH space (perceptually uniform).
 * Uses shortest-path hue interpolation.
 *
 * @param color1 - The first color string.
 * @param color2 - The second color string.
 * @param ratio - A number between 0 and 1 (0 = color1, 1 = color2).
 * @param format - Optional output color format.
 * @returns The mixed color string.
 */
export default function mix(
  color1: string,
  color2: string,
  ratio: number = 0.5,
  format?: ColorType,
): string {
  invariant(isString(color1), MESSAGES.inputString);
  invariant(isString(color2), MESSAGES.inputString);
  invariant(isNumberInRange(ratio, 0, 1), MESSAGES.ratioRange);

  const output = isHex(color1) || isNamedColor(color1) ? 'hex' : extractColorParts(color1).model;

  const lch1 = parseCSS(color1, 'oklch');
  const lch2 = parseCSS(color2, 'oklch');

  // Interpolate L and C linearly
  const l = lch1.l + (lch2.l - lch1.l) * ratio;
  const c = lch1.c + (lch2.c - lch1.c) * ratio;

  // Interpolate H with the shortest path (handle achromatic colors)
  const h = interpolateHue(lch1.h, lch2.h, lch1.c, lch2.c, ratio);

  // Handle alpha if present
  const alpha1 = lch1.alpha ?? 1;
  const alpha2 = lch2.alpha ?? 1;
  const alpha = alpha1 + (alpha2 - alpha1) * ratio;

  return formatCSS({ l, c, h }, { format: format ?? output, alpha: alpha < 1 ? alpha : undefined });
}
