import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { clamp, getScaleStepKeys, warn } from '~/modules/utils';
import { isNumber, isString } from '~/modules/validators';
import { getP3MaxChroma } from '~/p3';

import type { ColorType, LCH } from '~/types';

interface GeneratePaletteOptions extends Required<
  Pick<ScaleOptions, 'chromaCurve' | 'lightnessCurve' | 'maxLightness' | 'minLightness' | 'mode'>
> {
  baseChroma: number;
  hue: number;
  inputLightness: number | undefined;
  keys: number[];
  lock: number | undefined;
}

export type ScaleMode = 'light' | 'dark';

export type ScaleVariant = 'deep' | 'neutral' | 'pastel' | 'subtle' | 'vibrant';

/**
 * Options for generating a color scale.
 *
 * **Option Precedence:**
 * - `saturation` overrides `variant` if both are set
 * - `lock` affects palette calculation: steps are distributed relative to the locked position
 * - `mode` affects lightness direction: 'light' has lightest at low keys, 'dark' reverses this
 */
export interface ScaleOptions {
  /**
   * Controls chroma distribution across lightness levels (0-1).
   * - 0: Constant chroma across all steps (default).
   * - 1: Parabolic curve — full chroma at mid-lightness, reduced toward extremes.
   * - Values between interpolate between constant and parabolic.
   *
   * @default 0
   */
  chromaCurve?: number;
  /**
   * Output color format.
   *
   * Determines the format of the generated colors (e.g., HEX, RGB, OKLCH, etc.).
   *
   * If not specified, the output will match the format of the input color.
   */
  format?: ColorType;
  /**
   * The lightness tuning factor for the scale.
   * - 1: Linear lightness distribution.
   * - >1: Lighter tones are emphasized.
   * - <1: Darker tones are emphasized.
   * @default 1.5
   */
  lightnessCurve?: number;
  /**
   * Lock input color's lightness at specific step position.
   *
   * The input color's lightness is anchored at this step, and other steps
   * are distributed relative to it. Chroma is also preserved unless
   * `chromaCurve` or `saturation` are set, which recalculate chroma independently.
   *
   * Must be a valid step key for the current step count.
   * Default step keys (11 steps): 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.
   * Step keys vary based on the `steps` option (3-20 steps supported).
   */
  lock?: number;
  /**
   * The maximum lightness value for the scale.
   *
   * Defines the upper bound for the lightest color in the palette.
   *
   * A number between 0 and 1.
   * @default 0.97
   */
  maxLightness?: number;
  /**
   * The minimum lightness value for the scale.
   *
   * Defines the lower bound for the darkest color in the palette.
   *
   * A number between 0 and 1.
   *
   * @default 0.2
   */
  minLightness?: number;
  /**
   * Theme-aware lightness direction.
   *
   * - 'light': Low keys (50) are lightest, high keys (950) are darkest
   * - 'dark': Low keys (50) are darkest, high keys (950) are lightest
   *
   * @default 'light'
   */
  mode?: ScaleMode;
  /**
   * Global saturation override (0-100).
   *
   * When set, overrides the chroma for all generated shades.
   * Maps to chroma in OKLCH space.
   *
   * Overrides `variant` if both are set.
   */
  saturation?: number;
  /**
   * Number of steps in the scale (3-20).
   *
   * Controls how many color shades are generated.
   *
   * @default 11
   */
  steps?: number;
  /**
   * The variant of the scale.
   * - 'deep': Generates rich and bold tones with significantly reduced lightness.
   * - 'neutral': Generates muted tones by reducing chroma.
   * - 'pastel': Produces soft and airy tones with significant chroma reduction.
   * - 'subtle': Creates extremely desaturated tones, close to grayscale.
   * - 'vibrant': Enhances chroma for bold and striking tones.
   */
  variant?: ScaleVariant;
}

const chromaScale: Record<string, number> = {
  deep: 0.8,
  neutral: 0.5,
  pastel: 0.3,
  subtle: 0.2,
  vibrant: 1.25,
};

/**
 * Generate the color palette for the scale.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function generatePalette(options: GeneratePaletteOptions): Record<number, LCH> {
  const {
    baseChroma,
    chromaCurve,
    hue,
    inputLightness,
    keys,
    lightnessCurve,
    lock,
    maxLightness,
    minLightness,
    mode,
  } = options;

  const palette: Record<number, LCH> = {};

  // Calculate lightness values
  const lightnessMap: Record<number, number> = {};

  if (lock !== undefined && inputLightness !== undefined) {
    const lockIndex = keys.indexOf(lock);

    lightnessMap[lock] = inputLightness;

    // Keys before lock
    if (lockIndex > 0) {
      const target = mode === 'light' ? maxLightness : minLightness;

      for (let index = 0; index < lockIndex; index++) {
        const t = index / lockIndex;

        lightnessMap[keys[index]] = target + (inputLightness - target) * t ** lightnessCurve;
      }
    }

    // Keys after lock
    const remaining = keys.length - 1 - lockIndex;

    if (remaining > 0) {
      const target = mode === 'light' ? minLightness : maxLightness;

      for (let index = lockIndex + 1; index < keys.length; index++) {
        const t = (index - lockIndex) / remaining;

        lightnessMap[keys[index]] =
          inputLightness + (target - inputLightness) * t ** lightnessCurve;
      }
    }
  } else {
    // Standard calculation (no lock)
    for (let index = 0; index < keys.length; index++) {
      const t = (index / (keys.length - 1)) ** lightnessCurve;

      lightnessMap[keys[index]] =
        mode === 'light'
          ? maxLightness - (maxLightness - minLightness) * t
          : minLightness + (maxLightness - minLightness) * t;
    }
  }

  // Generate LCH colors
  for (const key of keys) {
    const lightness = lightnessMap[key];
    const chroma = getStepChroma(lightness, baseChroma, chromaCurve);
    const maxChroma = getP3MaxChroma({ l: lightness, c: 0, h: hue });

    palette[key] = { l: lightness, c: Math.min(chroma, maxChroma), h: hue };
  }

  return palette;
}

/**
 * Calculate chroma for a step, applying chromaCurve if set.
 */
function getStepChroma(lightness: number, baseChroma: number, chromaCurve: number): number {
  if (chromaCurve === 0) {
    return baseChroma;
  }

  const parabolic = 4 * lightness * (1 - lightness);
  const curveScale = 1 - chromaCurve * (1 - parabolic);

  return Math.max(0, baseChroma * curveScale);
}

/**
 * Generate a scale of colors based on the input color.
 *
 * This utility is ideal for designers and developers who need dynamic color
 * palettes for UI themes, design systems, or data visualization. Supports
 * multiple modes, scales, and variants for flexibility.
 *
 * @param input - The base color string.
 * @param options - Scale generation options.
 * @returns A record of step keys to color strings.
 */
export default function scale(input: string, options: ScaleOptions = {}): Record<number, string> {
  invariant(isString(input), MESSAGES.inputString);
  const {
    chromaCurve = 0,
    format,
    lightnessCurve = 1.5,
    lock: lockOption,
    maxLightness = 0.97,
    minLightness = 0.2,
    mode = 'light',
    saturation,
    steps: stepsOption,
    variant,
  } = options;

  invariant(
    maxLightness > minLightness && maxLightness <= 1 && minLightness >= 0,
    'maxLightness must be greater than minLightness and within the range [0, 1].',
  );

  const steps = stepsOption !== undefined ? Math.round(stepsOption) : 11;
  const keys = getScaleStepKeys(steps);

  // Validate lock option
  let lock = lockOption;

  if (lock !== undefined && (!isNumber(lock) || !keys.includes(lock))) {
    warn(`lock: ${lock} is not valid for steps: ${steps}, ignoring`);
    lock = undefined;
  }

  const parsed = resolveColor(input);
  const lch = parsed.oklch;

  // Determine base chroma
  let baseChroma: number;

  if (saturation !== undefined) {
    // saturation overrides: % of max P3 chroma at input's lightness
    const maxChroma = getP3MaxChroma(lch);

    baseChroma = (clamp(saturation, 0, 100) / 100) * maxChroma;
  } else if (variant && chromaScale[variant]) {
    baseChroma = lch.c * chromaScale[variant];
  } else {
    baseChroma = lch.c;
  }

  const colorFormat = format ?? parsed.type;

  // Generate the color palette
  const palette = generatePalette({
    baseChroma,
    chromaCurve,
    hue: lch.h,
    inputLightness: lock !== undefined ? lch.l : undefined,
    keys,
    lightnessCurve,
    lock,
    maxLightness,
    minLightness,
    mode,
  });

  return Object.fromEntries(
    Object.entries(palette).map(([key, value]) => [key, formatCSS(value, { format: colorFormat })]),
  );
}
