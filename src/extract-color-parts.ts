import hex2rgb from '~/converters/hex2rgb';
import { COLOR_KEYS, MESSAGES } from '~/modules/constants';
import { extractAlphaFromHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { hasValidMatches, isHex, isString } from '~/modules/validators';

import { ColorModelKey, PlainObject } from '~/types';

// Regex components for parsing CSS color strings
const MODEL = '(rgb|hsl|oklab|oklch)a?';
const SEP = '(?:\\s*[,/]\\s*|\\s+)';
// Accepts: numbers, percentages, 'none', and angle units (deg, grad, rad, turn)
const VALUE = '(none|[\\d%.-]+(?:deg|grad|rad|turn)?)';

const colorRegex = new RegExp(
  `${MODEL}\\s*\\(\\s*${VALUE}${SEP}${VALUE}${SEP}${VALUE}(?:${SEP}${VALUE})?\\s*\\)`,
  'i',
);

export type ExtractColorPartsReturn = {
  alpha?: number;
  model: ColorModelKey;
} & PlainObject<number>;

/**
 * Convert angle value with units to degrees
 */
function parseAngle(value: string): number {
  const number_ = parseFloat(value);
  let result: number;

  if (value.endsWith('grad')) {
    result = number_ * 0.9; // 400grad = 360deg
  } else if (value.endsWith('rad')) {
    result = number_ * (180 / Math.PI); // radians to degrees
  } else if (value.endsWith('turn')) {
    result = number_ * 360; // 1turn = 360deg
  } else {
    // 'deg' suffix or unitless - return as-is
    result = number_;
  }

  // Round to 5 decimal places for consistency
  return Math.round(result * 100000) / 100000;
}

/**
 * Extract the color parts from a CSS color string.
 * Hex colors are not supported.
 */
export default function extractColorParts(input: string) {
  invariant(isString(input), MESSAGES.inputString);

  if (isHex(input)) {
    const keys = COLOR_KEYS.rgb;
    const { r, g, b } = hex2rgb(input);
    const alpha = extractAlphaFromHex(input);

    return {
      model: 'rgb' as ColorModelKey,
      [keys[0]]: r,
      [keys[1]]: g,
      [keys[2]]: b,
      alpha: alpha < 1 ? alpha : undefined,
    } as ExtractColorPartsReturn;
  }

  const matches = colorRegex.exec(input);

  invariant(hasValidMatches(matches), MESSAGES.invalidCSS);

  const model = matches[1] as ColorModelKey;
  const keys = COLOR_KEYS[model];
  let alpha = matches[5] ? parseFloat(matches[5]) : 1;

  if (alpha > 1) {
    alpha /= 100;
  }

  // Parse values and convert percentages/angles for color models
  const parseValue = (value: string, index: number): number => {
    // Handle 'none' keyword - treated as 0 for rendering (CSS Color Level 4)
    if (value === 'none') {
      return 0;
    }

    // Handle hue values with angle units (HSL index 0, OkLCH index 2)
    const isHue = (model === 'hsl' && index === 0) || (model === 'oklch' && index === 2);

    if (isHue) {
      return parseAngle(value);
    }

    const parsedValue = parseFloat(value);
    const isPercent = value.includes('%');

    if (!isPercent) {
      return parsedValue;
    }

    // Convert percentages based on color model and position
    if (model === 'oklch') {
      // oklch: L (0-100), C (0-0.4), H (0-360)
      if (index === 1) {
        // Chroma: 100% = 0.4
        return (parsedValue * 0.4) / 100;
      }
    } else if (model === 'oklab') {
      // oklab: L (0-100), a (-0.4 to 0.4), b (-0.4 to 0.4)
      if (index === 1 || index === 2) {
        // a/b: ±100% = ±0.4
        return (parsedValue * 0.4) / 100;
      }
    }

    return parsedValue;
  };

  const values = [parseValue(matches[2], 0), parseValue(matches[3], 1), parseValue(matches[4], 2)];

  // Validate ranges for oklab/oklch after percentage conversion
  if (model === 'oklab') {
    // a and b must be in range -0.4 to 0.4
    invariant(values[1] >= -0.4 && values[1] <= 0.4, MESSAGES.invalidRange);
    invariant(values[2] >= -0.4 && values[2] <= 0.4, MESSAGES.invalidRange);
  } else if (model === 'oklch') {
    // chroma must be in range 0 to 0.4
    invariant(values[1] >= 0 && values[1] <= 0.4, MESSAGES.invalidRange);
  }

  return {
    model,
    [keys[0]]: values[0],
    [keys[1]]: values[1],
    [keys[2]]: values[2],
    alpha: alpha < 1 ? alpha : undefined,
  } as ExtractColorPartsReturn;
}
