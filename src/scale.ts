import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { clamp, getScaleStepKeys, warn } from '~/modules/utils';
import { isNumber, isNumberInRange, isString } from '~/modules/validators';
import { getP3MaxChroma } from '~/p3';

import type { ColorType, LCH } from '~/types';

/** Normalized chromaCurve: the parabola family or relative endpoints. */
type ChromaCurveConfig =
  | { amount: number; peak: number; type: 'parabola' }
  | { high: number; low: number; mid: number; type: 'endpoints' };

interface GeneratePaletteOptions extends Required<
  Pick<ScaleOptions, 'lightnessCurve' | 'maxLightness' | 'minLightness' | 'mode'>
> {
  baseChroma: number;
  chromaCurve: ChromaCurveConfig;
  hue: number;
  hueShift: ScaleRange;
  inputLightness: number | undefined;
  keys: number[];
  lock: number | undefined;
}

export type ScaleMode = 'light' | 'dark';

export type ScaleVariant = 'deep' | 'neutral' | 'pastel' | 'subtle' | 'vibrant';

/**
 * Parabolic chroma curve with a movable center.
 */
export interface ScaleChromaPeak {
  /** Blend between constant chroma (0) and the full parabola (1). */
  amount: number;
  /**
   * Lightness (exclusive 0-1) where chroma stays at full base.
   * @default 0.5
   */
  peak?: number;
}

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
   * Controls how chroma flows across the scale. Three forms:
   *
   * Scalar (0-1) — parabolic blend centered at mid-lightness:
   * - 0: Constant chroma across all steps (default).
   * - 1: Full parabola — peak chroma at mid-lightness, reduced toward extremes.
   * Shorthand for `{ amount: x }`.
   *
   * `{ amount, peak }` — the same parabola with a movable center.
   * `peak` is the lightness (exclusive 0-1) that keeps full base chroma;
   * sides away from it are reduced. Defaults to 0.5.
   *
   * `{ low, high }` — fractions (0-1) of the maximum P3 chroma at each step,
   * blended from `low` (50-end) through the input color's own fraction at the
   * lock/middle step to `high` (950-end). NOT equivalent to the scalar form —
   * it is a different model: values set chroma relative to the gamut ceiling
   * instead of bending the input's chroma. Being gamut-relative, the input's
   * chroma matters only at the anchor step; an achromatic input collapses the
   * anchor fraction to 0, yielding a V-shaped, colored scale (full at the ends,
   * gray at the anchor).
   *
   * @default 0
   */
  chromaCurve?: number | ScaleChromaPeak | ScaleRange;
  /**
   * Output color format.
   *
   * Determines the format of the generated colors (e.g., HEX, RGB, OKLCH, etc.).
   *
   * If not specified, the output will match the format of the input color.
   */
  format?: ColorType;
  /**
   * Hue rotation across the scale, in degrees.
   *
   * A scalar `x` is shorthand for `{ low: -x, high: x }`.
   * `low` shifts the low-key end (50), `high` the high-key end (950); shifts
   * blend to 0° at the lock step (or the middle step when not locked), so the
   * input hue is preserved there. The per-step gamut clamp follows the
   * shifted hue.
   *
   * Values must be within [-180, 180].
   *
   * @default 0
   */
  hueShift?: number | ScaleRange;
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

/**
 * Endpoint values for an asymmetric scale option.
 *
 * `low` applies at the low-key end (50), `high` at the high-key end (950),
 * regardless of `mode` — keys, not lightness, define the ends.
 */
export interface ScaleRange {
  high: number;
  low: number;
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
    hueShift,
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
  const anchorIndex = lock !== undefined ? keys.indexOf(lock) : Math.floor((keys.length - 1) / 2);
  const hasHueShift = hueShift.low !== 0 || hueShift.high !== 0;

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const lightness = lightnessMap[key];
    let stepHue = hue;

    if (hasHueShift && index !== anchorIndex) {
      const shift =
        index < anchorIndex
          ? hueShift.low * (1 - index / anchorIndex)
          : hueShift.high * ((index - anchorIndex) / (keys.length - 1 - anchorIndex));

      stepHue = (hue + shift + 360) % 360;
    }

    const maxChroma = getP3MaxChroma({ l: lightness, c: 0, h: stepHue });
    const chroma =
      chromaCurve.type === 'endpoints'
        ? getStepRelativeChroma(chromaCurve, index, anchorIndex, keys.length) * maxChroma
        : getStepChroma(lightness, baseChroma, chromaCurve.amount, chromaCurve.peak);

    palette[key] = { l: lightness, c: Math.min(chroma, maxChroma), h: stepHue };
  }

  return palette;
}

/**
 * Calculate chroma for a step from the parabola family.
 */
function getStepChroma(
  lightness: number,
  baseChroma: number,
  amount: number,
  peak: number,
): number {
  if (amount === 0) {
    return baseChroma;
  }

  // peak 0.5 keeps the legacy expression so scalar output stays bit-identical
  const parabolic =
    peak === 0.5
      ? 4 * lightness * (1 - lightness)
      : Math.max(0, 1 - ((lightness - peak) / Math.max(peak, 1 - peak)) ** 2);
  const curveScale = 1 - amount * (1 - parabolic);

  return Math.max(0, baseChroma * curveScale);
}

/**
 * Fraction of the gamut ceiling for a step: low → mid (anchor) → high.
 */
function getStepRelativeChroma(
  curve: Extract<ChromaCurveConfig, { type: 'endpoints' }>,
  index: number,
  anchorIndex: number,
  total: number,
): number {
  const { high, low, mid } = curve;

  if (index === anchorIndex) {
    return mid;
  }

  if (index < anchorIndex) {
    return low + (mid - low) * (index / anchorIndex);
  }

  return mid + (high - mid) * ((index - anchorIndex) / (total - 1 - anchorIndex));
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
    hueShift = 0,
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

  const hueShiftRange: ScaleRange = isNumber(hueShift)
    ? { low: -hueShift, high: hueShift }
    : hueShift;

  invariant(
    isNumberInRange(hueShiftRange.low, -180, 180) && isNumberInRange(hueShiftRange.high, -180, 180),
    'hueShift values must be within the range [-180, 180].',
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

  // Normalize chromaCurve: scalar → parabola at 0.5; objects discriminate by key
  let chromaCurveConfig: ChromaCurveConfig;

  if (isNumber(chromaCurve)) {
    invariant(isNumberInRange(chromaCurve, 0, 1), 'chromaCurve must be within the range [0, 1].');
    chromaCurveConfig = { amount: chromaCurve, peak: 0.5, type: 'parabola' };
  } else if ('amount' in chromaCurve) {
    const { amount, peak = 0.5 } = chromaCurve;

    invariant(isNumberInRange(amount, 0, 1), 'chromaCurve amount must be within the range [0, 1].');
    invariant(
      isNumber(peak) && peak > 0 && peak < 1,
      'chromaCurve peak must be within the range (0, 1).',
    );
    chromaCurveConfig = { amount, peak, type: 'parabola' };
  } else {
    const { high, low } = chromaCurve;

    invariant(
      isNumberInRange(low, 0, 1) && isNumberInRange(high, 0, 1),
      'chromaCurve low/high must be within the range [0, 1].',
    );

    // guard near-black/white inputs where the ceiling collapses to 0
    const maxChromaAtInput = getP3MaxChroma(lch);

    chromaCurveConfig = {
      high,
      low,
      mid: maxChromaAtInput > 0 ? clamp(baseChroma / maxChromaAtInput, 0, 1) : 0,
      type: 'endpoints',
    };
  }

  // Generate the color palette
  const palette = generatePalette({
    baseChroma,
    chromaCurve: chromaCurveConfig,
    hue: lch.h,
    hueShift: hueShiftRange,
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
