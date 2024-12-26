import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { clamp } from '~/modules/utils';
import { isHex, isNamedColor, isString } from '~/modules/validators';

import convert from '~/convert';
import { oklch2hex } from '~/converters';
import oklch2rgb from '~/converters/oklch2rgb';
import rgb2hex from '~/converters/rgb2hex';
import extractColorParts from '~/extract-color-parts';
import parseCSS from '~/parse-css';
import { ColorTokens, ColorType, HEX, LCH } from '~/types';

export type Swatch = {
  [key in ColorTokens]: string;
};

export type SwatchVariant = 'deep' | 'neutral' | 'pastel' | 'subtle' | 'vibrant';

export interface SwatchOptions {
  /**
   * Output color format.
   *
   * If not specified, the output will use the same format as the input color.
   */
  format?: ColorType;
  /**
   * The mode of the swatch.
   * - 'light': Focuses on lighter tones starting from a higher lightness.
   * - 'dark': Focuses on darker tones starting from a lower lightness.
   *
   * If omitted, a balanced palette is generated.
   */
  mode?: 'light' | 'dark';
  /**
   * Generate a monochromatic swatch.
   *
   * Disable chroma adjustments for all shades.
   * @default false
   */
  monochromatic?: boolean;
  /**
   * Determines the scale type for the swatch.
   * - 'linear': Shades are distributed with equal lightness intervals.
   * - 'dynamic': Shades are distributed adaptively based on the input color.
   * @default 'dynamic'
   */
  scale?: 'dynamic' | 'linear';
  /**
   * The variant of the swatch.
   * - 'deep': Generates rich and bold tones with significantly reduced lightness.
   * - 'neutral': Generates muted tones by reducing chroma.
   * - 'pastel': Produces soft and airy tones with significant chroma reduction.
   * - 'subtle': Creates extremely desaturated tones, close to grayscale.
   * - 'vibrant': Enhances chroma for bold and striking tones.
   */
  variant?: SwatchVariant;
}

const MIN_LIGHTNESS = 5;
const MAX_LIGHTNESS = 95;

/**
 * Generate a shade of a color based its lightness tuning factor
 */
function shadeColorDynamic(input: LCH, lightnessTuningFactor: number, chromaFactor = 0): HEX {
  if (lightnessTuningFactor === 0) {
    const { l } = input;

    return rgb2hex(oklch2rgb({ ...input, l: l / 100 }));
  }

  // Convert back to RGB and make sure it's within the sRGB gamut
  return shadeColor(input, input.l + lightnessTuningFactor, chromaFactor);
}

/**
 * Generate a shade of a color based its lightness tuning factor
 */
function shadeColor(input: LCH, lightness: number, chromaFactor = 0): HEX {
  const { c, h } = input;

  const adjustedChroma = clamp(c + chromaFactor, 0, 0.4);

  // Convert back to RGB and make sure it's within the sRGB gamut
  return oklch2hex({ l: lightness / 100, c: adjustedChroma, h });
}

/**
 * Generate a palette of shades of a color
 */
export default function swatch(input: string, options: SwatchOptions = {}): Swatch {
  invariant(isString(input), MESSAGES.inputString);
  const { format, monochromatic = false, scale = 'dynamic', mode, variant = 'base' } = options;

  const lch = parseCSS(input, 'oklch');
  const chromaScale = {
    base: 1,
    deep: 0.8,
    neutral: 0.5,
    pastel: 0.3,
    subtle: 0.2,
    vibrant: 1.25,
  }[variant];

  lch.l = 50;
  lch.c *= chromaScale;

  if (variant === 'deep') {
    lch.l *= 0.7;
  }

  const colorFormat = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;

  const currentLightness = lch.l;
  let lightSteps = 5;
  let darkSteps = 8;

  if (mode) {
    lightSteps *= mode === 'light' ? 0.75 : 1.25;
    darkSteps *= mode === 'light' ? 1.25 : 0.75;
  }

  const lightStepSize = (MAX_LIGHTNESS - currentLightness) / lightSteps;
  const darkStepSize = (-1 * (currentLightness - MIN_LIGHTNESS)) / darkSteps;

  const getChromaFactor = (value: number): number => {
    return monochromatic ? 0 : value; // Disable adjustments for monochromatic swatches
  };

  const output: Swatch =
    scale === 'linear'
      ? {
          50: shadeColor(lch, 95, getChromaFactor(-0.00375)),
          100: shadeColor(lch, 90, getChromaFactor(-0.00375)),
          200: shadeColor(lch, 80, getChromaFactor(-0.00375)),
          300: shadeColor(lch, 70, getChromaFactor(-0.00375)),
          400: shadeColor(lch, 60, getChromaFactor(-0.00375)),
          500: shadeColor(lch, 50),
          600: shadeColor(lch, 40, getChromaFactor(0.025)),
          700: shadeColor(lch, 30, getChromaFactor(0.05)),
          800: shadeColor(lch, 20, getChromaFactor(0.075)),
          900: shadeColor(lch, 10, getChromaFactor(0.1)),
        }
      : {
          50: shadeColorDynamic(lch, 5 * lightStepSize, getChromaFactor(-0.00375)),
          100: shadeColorDynamic(lch, 4 * lightStepSize, getChromaFactor(-0.00375)),
          200: shadeColorDynamic(lch, 3 * lightStepSize, getChromaFactor(-0.00375)),
          300: shadeColorDynamic(lch, 2 * lightStepSize, getChromaFactor(-0.00375)),
          400: shadeColorDynamic(lch, lightStepSize, getChromaFactor(-0.00375)),
          500: shadeColorDynamic(lch, 0),
          600: shadeColorDynamic(lch, 1.6 * darkStepSize, getChromaFactor(0.025)),
          700: shadeColorDynamic(lch, 3.2 * darkStepSize, getChromaFactor(0.05)),
          800: shadeColorDynamic(lch, 4.8 * darkStepSize, getChromaFactor(0.075)),
          900: shadeColorDynamic(lch, 6.4 * darkStepSize, getChromaFactor(0.1)),
        };

  return Object.entries(output).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: convert(value, format ?? colorFormat),
    };
  }, {} as Swatch);
}
