import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { isNumberInRange, isString } from '~/modules/validators';

import { ColorModel, ColorModelKey, ColorType, HSL, LAB, LCH, RGB } from '~/types';

export type HueMode = 'shorter' | 'longer' | 'increasing' | 'decreasing';

export interface MixOptions {
  format?: ColorType;
  hue?: HueMode;
  space?: ColorModelKey;
}

function interpolateAlpha(a1: number, a2: number, ratio: number): number {
  return a1 + (a2 - a1) * ratio;
}

/**
 * Interpolate hue with configurable arc direction.
 * Handles achromatic colors (chroma ≈ 0) by using the other color's hue.
 */
function interpolateHue(
  h1: number,
  h2: number,
  c1: number,
  c2: number,
  ratio: number,
  mode: HueMode = 'shorter',
): number {
  // Threshold works for both OkLCH chroma (0-0.37) and HSL saturation (0-100):
  // any value below 0.0001 is effectively achromatic in either space
  if (c1 < 0.0001) {
    return h2;
  }

  if (c2 < 0.0001) {
    return h1;
  }

  let diff = h2 - h1;

  switch (mode) {
    case 'shorter': {
      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }

      break;
    }
    case 'longer': {
      if (diff > 0 && diff < 180) {
        diff -= 360;
      } else if (diff > -180 && diff <= 0) {
        diff += 360;
      }

      break;
    }
    case 'increasing': {
      if (diff < 0) {
        diff += 360;
      }

      break;
    }
    case 'decreasing': {
      if (diff > 0) {
        diff -= 360;
      }

      break;
    }
  }

  const result = h1 + diff * ratio;

  return ((result % 360) + 360) % 360;
}

function mixInHSL(c1: HSL, c2: HSL, ratio: number, hueMode: HueMode) {
  return {
    h: interpolateHue(c1.h, c2.h, c1.s, c2.s, ratio, hueMode),
    s: c1.s + (c2.s - c1.s) * ratio,
    l: c1.l + (c2.l - c1.l) * ratio,
  };
}

function mixInOkLab(c1: LAB, c2: LAB, ratio: number) {
  return {
    l: c1.l + (c2.l - c1.l) * ratio,
    a: c1.a + (c2.a - c1.a) * ratio,
    b: c1.b + (c2.b - c1.b) * ratio,
  };
}

function mixInOkLCH(c1: LCH, c2: LCH, ratio: number, hueMode: HueMode) {
  return {
    l: c1.l + (c2.l - c1.l) * ratio,
    c: c1.c + (c2.c - c1.c) * ratio,
    h: interpolateHue(c1.h, c2.h, c1.c, c2.c, ratio, hueMode),
  };
}

function mixInRGB(c1: RGB, c2: RGB, ratio: number) {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * ratio),
    g: Math.round(c1.g + (c2.g - c1.g) * ratio),
    b: Math.round(c1.b + (c2.b - c1.b) * ratio),
  };
}

/**
 * Mix two colors using interpolation in the specified color space.
 *
 * @param color1 - The first color string.
 * @param color2 - The second color string.
 * @param ratio - A number between 0 and 1 (0 = color1, 1 = color2).
 * @param formatOrOptions - Output format or mix options object.
 * @returns The mixed color string.
 */
export default function mix(
  color1: string,
  color2: string,
  ratio: number = 0.5,
  formatOrOptions?: ColorType | MixOptions,
): string {
  invariant(isString(color1), MESSAGES.inputString);
  invariant(isString(color2), MESSAGES.inputString);
  invariant(isNumberInRange(ratio, 0, 1), MESSAGES.ratioRange);

  const {
    format,
    hue = 'shorter',
    space = 'oklch',
  } = isString(formatOrOptions, false) ? { format: formatOrOptions } : (formatOrOptions ?? {});
  const parsed1 = resolveColor(color1);
  const parsed2 = resolveColor(color2);
  const output = format ?? parsed1.type;

  let color: ColorModel;

  switch (space) {
    case 'hsl': {
      color = mixInHSL(parsed1.hsl, parsed2.hsl, ratio, hue);
      break;
    }
    case 'oklab': {
      color = mixInOkLab(parsed1.oklab, parsed2.oklab, ratio);
      break;
    }
    case 'rgb': {
      color = mixInRGB(parsed1.rgb, parsed2.rgb, ratio);
      break;
    }

    case 'oklch':
    default: {
      color = mixInOkLCH(parsed1.oklch, parsed2.oklch, ratio, hue);
      break;
    }
  }

  const alpha = interpolateAlpha(parsed1.alpha, parsed2.alpha, ratio);

  return formatCSS(color, { format: output, alpha: alpha < 1 ? alpha : undefined });
}
