import apcaContrast from '~/apca';
import contrast from '~/contrast';
import luminance from '~/luminance';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { isString } from '~/modules/validators';

export type ReadableColorMethod = 'apca' | 'contrast' | 'oklab' | 'wcag' | 'yiq';

export interface ReadableColorOptions {
  /**
   * The dark color to return if the background is light.
   * @default '#000000'
   */
  darkColor?: string;
  /**
   * The light color to return if the background is dark.
   * @default '#ffffff'
   */
  lightColor?: string;
  /**
   * The method to use for determining contrast.
   *
   * - `yiq`: YIQ brightness formula (fast, simple)
   * - `wcag`: WCAG 2.x relative luminance threshold
   * - `contrast`: WCAG 2.x contrast ratio comparison
   * - `oklab`: OkLab perceptual lightness threshold
   * - `apca`: APCA contrast comparison (WCAG 3.0 candidate)
   *
   * @default 'yiq'
   */
  method?: ReadableColorMethod;
  /**
   * The threshold for threshold-based methods.
   *
   * - `yiq`: 0-255 (default: 128)
   * - `wcag`: 0-1 (default: 0.5)
   * - `oklab`: 0-1 (default: 0.5)
   * - `contrast` and `apca`: ignored (comparison-based)
   */
  threshold?: number;
}

/**
 * Compare two contrast values and return the color with higher contrast.
 * Returns darkColor if equal (arbitrary but consistent).
 */
function pickByContrast(
  darkContrast: number,
  lightContrast: number,
  darkColor: string,
  lightColor: string,
): string {
  return darkContrast >= lightContrast ? darkColor : lightColor;
}

/**
 * Get the most readable color (light or dark) for a given background.
 *
 * Supports multiple methods for determining contrast:
 * - `yiq`: Simple YIQ brightness formula (default, backwards compatible)
 * - `wcag`: WCAG 2.x relative luminance with threshold
 * - `contrast`: WCAG 2.x contrast ratio comparison
 * - `oklab`: OkLab perceptual lightness with threshold
 * - `apca`: APCA contrast comparison (WCAG 3.0 candidate)
 *
 * @param backgroundColor - The background color string.
 * @param methodOrOptions - Method or options object.
 * @returns The most readable color (light or dark).
 */

export default function readableColor(
  backgroundColor: string,
  methodOrOptions?: ReadableColorMethod | ReadableColorOptions,
): string {
  const {
    darkColor = '#000000',
    lightColor = '#ffffff',
    method = 'yiq',
    threshold,
  } = isString(methodOrOptions, false) ? { method: methodOrOptions } : (methodOrOptions ?? {});

  invariant(isString(backgroundColor), MESSAGES.inputString);

  const parsed = resolveColor(backgroundColor);
  const bgCSS = parsed.toCSS();

  switch (method) {
    case 'yiq': {
      const yiqThreshold = threshold ?? 128;

      invariant(yiqThreshold >= 0 && yiqThreshold <= 255, MESSAGES.threshold);

      const { r, g, b } = parsed.rgb;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;

      return yiq >= yiqThreshold ? darkColor : lightColor;
    }
    case 'wcag': {
      const wcagThreshold = threshold ?? 0.5;

      invariant(wcagThreshold >= 0 && wcagThreshold <= 1, MESSAGES.thresholdNormalized);

      const lum = luminance(bgCSS);

      return lum >= wcagThreshold ? darkColor : lightColor;
    }
    case 'contrast': {
      const darkContrast = contrast(darkColor, bgCSS);
      const lightContrast = contrast(lightColor, bgCSS);

      return pickByContrast(darkContrast, lightContrast, darkColor, lightColor);
    }
    case 'oklab': {
      const oklabThreshold = threshold ?? 0.5;

      invariant(oklabThreshold >= 0 && oklabThreshold <= 1, MESSAGES.thresholdNormalized);

      const { l } = parsed.oklab;

      return l >= oklabThreshold ? darkColor : lightColor;
    }
    case 'apca': {
      const darkContrast = Math.abs(apcaContrast(bgCSS, darkColor));
      const lightContrast = Math.abs(apcaContrast(bgCSS, lightColor));

      return pickByContrast(darkContrast, lightContrast, darkColor, lightColor);
    }
    /* v8 ignore next 3 -- @preserve */
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}
