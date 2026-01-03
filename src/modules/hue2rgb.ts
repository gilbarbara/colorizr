import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isNumber } from '~/modules/validators';

/**
 * Convert hue to RGB using chroma and median point.
 *
 * @param point - The median point value.
 * @param chroma - The chroma value.
 * @param h - The hue value (0-1).
 * @returns The RGB component value.
 */
export default function hue2rgb(point: number, chroma: number, h: number): number {
  invariant(isNumber(point) && isNumber(chroma) && isNumber(h), MESSAGES.hueArgs);
  let hue = h;

  if (hue < 0) {
    hue += 1;
  }

  if (hue > 1) {
    hue -= 1;
  }

  if (hue < 1 / 6) {
    return round(point + (chroma - point) * 6 * hue, 4);
  }

  if (hue < 1 / 2) {
    return round(chroma, 4);
  }

  if (hue < 2 / 3) {
    return round(point + (chroma - point) * (2 / 3 - hue) * 6, 4);
  }

  return round(point, 4);
}
