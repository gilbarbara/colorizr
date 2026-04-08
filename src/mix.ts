import extractColorParts from '~/extract-color-parts';
import formatCSS from '~/format-css';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isNumberInRange, isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

import { ColorModelKey, ColorType } from '~/types';

export type HueMode = 'shorter' | 'longer' | 'increasing' | 'decreasing';

export interface MixOptions {
  format?: ColorType;
  hue?: HueMode;
  space?: ColorModelKey;
}

function interpolateAlpha(a1: number | undefined, a2: number | undefined, ratio: number): number {
  const alpha1 = a1 ?? 1;
  const alpha2 = a2 ?? 1;

  return alpha1 + (alpha2 - alpha1) * ratio;
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

function mixInHSL(color1: string, color2: string, ratio: number, hueMode: HueMode) {
  const c1 = parseCSS(color1, 'hsl');
  const c2 = parseCSS(color2, 'hsl');

  return {
    color: {
      h: interpolateHue(c1.h, c2.h, c1.s, c2.s, ratio, hueMode),
      s: c1.s + (c2.s - c1.s) * ratio,
      l: c1.l + (c2.l - c1.l) * ratio,
    },
    alpha: interpolateAlpha(c1.alpha, c2.alpha, ratio),
  };
}

function mixInOkLab(color1: string, color2: string, ratio: number) {
  const c1 = parseCSS(color1, 'oklab');
  const c2 = parseCSS(color2, 'oklab');

  return {
    color: {
      l: c1.l + (c2.l - c1.l) * ratio,
      a: c1.a + (c2.a - c1.a) * ratio,
      b: c1.b + (c2.b - c1.b) * ratio,
    },
    alpha: interpolateAlpha(c1.alpha, c2.alpha, ratio),
  };
}

function mixInOkLCH(color1: string, color2: string, ratio: number, hueMode: HueMode) {
  const c1 = parseCSS(color1, 'oklch');
  const c2 = parseCSS(color2, 'oklch');

  return {
    color: {
      l: c1.l + (c2.l - c1.l) * ratio,
      c: c1.c + (c2.c - c1.c) * ratio,
      h: interpolateHue(c1.h, c2.h, c1.c, c2.c, ratio, hueMode),
    },
    alpha: interpolateAlpha(c1.alpha, c2.alpha, ratio),
  };
}

function mixInRGB(color1: string, color2: string, ratio: number) {
  const c1 = parseCSS(color1, 'rgb');
  const c2 = parseCSS(color2, 'rgb');

  return {
    color: {
      r: Math.round(c1.r + (c2.r - c1.r) * ratio),
      g: Math.round(c1.g + (c2.g - c1.g) * ratio),
      b: Math.round(c1.b + (c2.b - c1.b) * ratio),
    },
    alpha: interpolateAlpha(c1.alpha, c2.alpha, ratio),
  };
}

/**
 * Mix two colors using interpolation in the specified color space.
 *
 * @param color1 - The first color string.
 * @param color2 - The second color string.
 * @param ratio - A number between 0 and 1 (0 = color1, 1 = color2).
 * @param options - Mix options: format, hue mode, interpolation space.
 * @returns The mixed color string.
 */
export default function mix(
  color1: string,
  color2: string,
  ratio: number = 0.5,
  options?: MixOptions,
): string {
  invariant(isString(color1), MESSAGES.inputString);
  invariant(isString(color2), MESSAGES.inputString);
  invariant(isNumberInRange(ratio, 0, 1), MESSAGES.ratioRange);

  const { format, hue = 'shorter', space = 'oklch' } = options ?? {};
  const output =
    format ?? (isHex(color1) || isNamedColor(color1) ? 'hex' : extractColorParts(color1).model);

  let interpolated;

  switch (space) {
    case 'oklch': {
      interpolated = mixInOkLCH(color1, color2, ratio, hue);
      break;
    }
    case 'hsl': {
      interpolated = mixInHSL(color1, color2, ratio, hue);
      break;
    }
    case 'oklab': {
      interpolated = mixInOkLab(color1, color2, ratio);
      break;
    }
    case 'rgb': {
      interpolated = mixInRGB(color1, color2, ratio);
      break;
    }
  }

  const { color, alpha } = interpolated;

  return formatCSS(color, { format: output, alpha: alpha < 1 ? alpha : undefined });
}
