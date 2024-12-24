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
import { ColorType, HEX, LCH } from '~/types';

type ColorTokens = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type Swatch = {
  [key in ColorTokens]: string;
};

export interface SwatchOptions {
  format?: ColorType;
  /**
   * Generate a monochromatic swatch.
   * @default false
   */
  monochromatic?: boolean;
  /**
   * The scale of the swatch.
   * Linear scale will have equal distance between each shade.
   * @default 'dynamic'
   */
  scale?: 'dynamic' | 'linear' | 'monochromatic';
}

const MIN_LIGHTNESS = 21;
const MAX_LIGHTNESS = 97;

/**
 * Generate a shade of a color based its lightness tuning factor
 */
function shadeColorDynamic(input: LCH, lightnessTuningFactor: number, chromaTuningFactor = 0): HEX {
  if (lightnessTuningFactor === 0) {
    return rgb2hex(oklch2rgb({ ...input, l: input.l / 100 }));
  }

  // Convert back to RGB and make sure it's within the sRGB gamut
  return shadeColor(input, input.l + lightnessTuningFactor, chromaTuningFactor);
}

/**
 * Generate a shade of a color based its lightness tuning factor
 */
function shadeColor(input: LCH, lightness: number, chromaTuningFactor = 0): HEX {
  const { c, h } = input;

  // Convert back to RGB and make sure it's within the sRGB gamut
  return oklch2hex({ l: lightness / 100, c: clamp(c + chromaTuningFactor, 0, 0.4), h });
}

/**
 * Generate a palette of shades of a color
 */
export default function swatch(input: string, options: SwatchOptions = {}): Swatch {
  invariant(isString(input), MESSAGES.inputString);
  const { format, monochromatic = false, scale = 'dynamic' } = options;

  const lch = parseCSS(input, 'oklch');

  lch.l = 50;

  const colorFormat = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;

  const currentLightness = lch.l;
  const safeMaxLightness = currentLightness >= 88.5 ? 99.5 : MAX_LIGHTNESS;
  const safeMinLightness = currentLightness <= 33 ? 0 : MIN_LIGHTNESS;
  const lightBase = (safeMaxLightness - currentLightness) / 5;
  const darkBase = (-1 * (currentLightness - safeMinLightness)) / 8;

  const output: Swatch =
    scale === 'linear'
      ? {
          50: shadeColor(lch, 95, monochromatic ? 0 : -0.00375),
          100: shadeColor(lch, 90, monochromatic ? 0 : -0.00375),
          200: shadeColor(lch, 80, monochromatic ? 0 : -0.00375),
          300: shadeColor(lch, 70, monochromatic ? 0 : -0.00375),
          400: shadeColor(lch, 60, monochromatic ? 0 : -0.00375),
          500: shadeColor(lch, 50, 0),
          600: shadeColor(lch, 40, monochromatic ? 0 : 0.025),
          700: shadeColor(lch, 30, monochromatic ? 0 : 0.05),
          800: shadeColor(lch, 20, monochromatic ? 0 : 0.075),
          900: shadeColor(lch, 10, monochromatic ? 0 : 0.1),
        }
      : {
          50: shadeColorDynamic(lch, 5 * lightBase, monochromatic ? 0 : -0.00375),
          100: shadeColorDynamic(lch, 4 * lightBase, monochromatic ? 0 : -0.00375),
          200: shadeColorDynamic(lch, 3 * lightBase, monochromatic ? 0 : -0.00375),
          300: shadeColorDynamic(lch, 2 * lightBase, monochromatic ? 0 : -0.00375),
          400: shadeColorDynamic(lch, lightBase, monochromatic ? 0 : -0.00375),
          500: shadeColorDynamic(lch, 0),
          600: shadeColorDynamic(lch, 1.6 * darkBase, monochromatic ? 0 : 0.025),
          700: shadeColorDynamic(lch, 1.875 * 2 * darkBase, monochromatic ? 0 : 0.05),
          800: shadeColorDynamic(lch, 3 * 2 * darkBase, monochromatic ? 0 : 0.075),
          900: shadeColorDynamic(lch, 4 * 2 * darkBase, monochromatic ? 0 : 0.1),
        };

  return Object.entries(output).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: convert(value, format ?? colorFormat),
    };
  }, {} as Swatch);
}
