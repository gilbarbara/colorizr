import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { clamp } from '~/modules/utils';
import { isHex, isNamedColor, isString } from '~/modules/validators';

import convert from '~/convert';
import { oklch2hex } from '~/converters';
import extractColorParts from '~/extract-color-parts';
import parseCSS from '~/parse-css';
import { ColorTokens, ColorType, HEX, LCH } from '~/types';

export type Swatch = {
  [key in ColorTokens]: string;
};

export type SwatchVariant = 'deep' | 'neutral' | 'pastel' | 'subtle' | 'vibrant';

export interface SwatchOptions {
  format?: ColorType;
  mode?: 'light' | 'dark';
  monochromatic?: boolean;
  scale?: 'dynamic' | 'linear';
  variant?: SwatchVariant;
}

const MIN_LIGHTNESS = 0.05;
const MAX_LIGHTNESS = 0.95;

function adjustLightnessForChroma(target: number, chroma: number): number {
  // Reduce the compression effect based on chroma to balance lighter tones
  const compressionFactor = Math.min(chroma * 0.75, 0.15);
  const midPoint = 0.5;

  if (target > midPoint) {
    const distance = target - midPoint;

    return midPoint + distance * (1 - compressionFactor);
  }

  return target;
}

function shadeColor(input: LCH, lightness: number, chromaFactor = 0): HEX {
  const { c, h } = input;

  // Scale chroma inversely with distance from middle lightness
  const distanceFromMid = Math.abs(lightness - 0.65); // Adjusted midpoint
  const chromaScale = Math.max(0.2, 1 - distanceFromMid * 1.5);

  // Calculate final chroma
  const baseChroma = c * chromaScale;
  const adjustedChroma = clamp(baseChroma + chromaFactor, 0, 0.4);

  return oklch2hex({ l: lightness, c: adjustedChroma, h });
}

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

  lch.l = 0.65;
  lch.c *= chromaScale;

  if (variant === 'deep') {
    lch.l *= 0.7;
  }

  const colorFormat = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;

  const currentLightness = lch.l;
  let lightSteps = 5;
  let darkSteps = 8;

  if (mode) {
    lightSteps *= mode === 'light' ? 0.86 : 1.2;
    darkSteps *= mode === 'light' ? 1.2 : 0.86;
  }

  const lightStepSize = (MAX_LIGHTNESS - currentLightness) / lightSteps;
  const darkStepSize = (-1 * (currentLightness - MIN_LIGHTNESS)) / darkSteps;

  const getChromaFactor = (value: number): number => {
    return monochromatic ? 0 : value;
  };

  const baseValues =
    scale === 'linear'
      ? {
          50: 0.95,
          100: 0.9,
          200: 0.8,
          300: 0.7,
          400: 0.6,
          500: 0.55,
          600: 0.4,
          700: 0.3,
          800: 0.2,
          900: 0.1,
        }
      : {
          50: currentLightness + 5 * lightStepSize,
          100: currentLightness + 4 * lightStepSize,
          200: currentLightness + 3 * lightStepSize,
          300: currentLightness + 2 * lightStepSize,
          400: currentLightness + lightStepSize,
          500: currentLightness,
          600: currentLightness + 1.6 * darkStepSize,
          700: currentLightness + 3.2 * darkStepSize,
          800: currentLightness + 4.8 * darkStepSize,
          900: currentLightness + 6.4 * darkStepSize,
        };

  // Adjust lightness values based on the input color's characteristics
  const lightnessValues = Object.entries(baseValues).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: adjustLightnessForChroma(value, lch.c),
    }),
    {} as Record<keyof typeof baseValues, number>,
  );

  const output: Swatch = {
    50: shadeColor(lch, lightnessValues[50], getChromaFactor(-0.00375)),
    100: shadeColor(lch, lightnessValues[100], getChromaFactor(-0.00375)),
    200: shadeColor(lch, lightnessValues[200], getChromaFactor(-0.00375)),
    300: shadeColor(lch, lightnessValues[300], getChromaFactor(-0.00375)),
    400: shadeColor(lch, lightnessValues[400], getChromaFactor(-0.00375)),
    500: shadeColor(lch, lightnessValues[500]),
    600: shadeColor(lch, lightnessValues[600], getChromaFactor(0.025)),
    700: shadeColor(lch, lightnessValues[700], getChromaFactor(0.05)),
    800: shadeColor(lch, lightnessValues[800], getChromaFactor(0.075)),
    900: shadeColor(lch, lightnessValues[900], getChromaFactor(0.1)),
  };

  return Object.entries(output).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: convert(value, format ?? colorFormat),
    };
  }, {} as Swatch);
}
