import formatCSS from '~/format-css';
import { clamp } from '~/modules/utils';

import { ColorType } from '~/types';

interface RandomOptions {
  /**
   * The color format to return.
   * @default 'hex'
   */
  format?: ColorType;
  /**
   * Maximum hue value (0-360).
   * @default 360
   */
  maxHue?: number;
  /**
   * Maximum lightness value (0-100).
   * @default 90
   */
  maxLightness?: number;
  /**
   * Maximum saturation value (0-100).
   * @default 100
   */
  maxSaturation?: number;
  /**
   * Minimum hue value (0-360).
   * If minHue > maxHue, the range wraps around 0° (e.g., 330-30 for reds).
   * @default 0
   */
  minHue?: number;
  /**
   * Minimum lightness value (0-100).
   * @default 10
   */
  minLightness?: number;
  /**
   * Minimum saturation value (0-100).
   * @default 10
   */
  minSaturation?: number;
}

/**
 * Generate a random number within a range.
 * Supports wrap-around for hue values (when min > max).
 */
function randomInRange(min: number, max: number, wrapAt?: number): number {
  if (wrapAt && min > max) {
    // Handle wrap-around (e.g., hue 330-30 spans through 0)
    const range = wrapAt - min + max;
    const value = min + Math.floor(Math.random() * range);

    return value >= wrapAt ? value - wrapAt : value;
  }

  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Generate a random color.
 *
 * @param options - Options to constrain the random color generation.
 * @returns The random color string.
 */
export default function random(options: RandomOptions = {}): string {
  const { format = 'hex' } = options;

  const minHue = clamp(options.minHue ?? 0, 0, 360);
  const maxHue = clamp(options.maxHue ?? 360, 0, 360);
  const minSaturation = clamp(options.minSaturation ?? 10, 0, 100);
  const maxSaturation = clamp(options.maxSaturation ?? 100, 0, 100);
  const minLightness = clamp(options.minLightness ?? 10, 0, 100);
  const maxLightness = clamp(options.maxLightness ?? 90, 0, 100);

  const hsl = {
    h: randomInRange(minHue, maxHue, 360),
    s: randomInRange(
      Math.min(minSaturation, maxSaturation),
      Math.max(minSaturation, maxSaturation),
    ),
    l: randomInRange(Math.min(minLightness, maxLightness), Math.max(minLightness, maxLightness)),
  };

  return formatCSS(hsl, { format });
}
