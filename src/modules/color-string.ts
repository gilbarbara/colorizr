import formatHex from '~/format-hex';
import { COLOR_KEYS, MESSAGES } from '~/modules/constants';
import { CSSColor, cssColors } from '~/modules/css-colors';
import { invariant } from '~/modules/invariant';
import { trimCSSWhitespace } from '~/modules/utils';
import { hasValidMatches, isHex, isNamedColor, isString } from '~/modules/validators';

import { ColorModelKey, HEX } from '~/types';

// Regex components for parsing CSS color strings
const MODEL = '(rgb|hsl|oklab|oklch)a?';
const SEP = '(?:\\s*[,/]\\s*|\\s+)';
// CSS <number>: optional sign, digits with an optional fraction (or a leading '.'), optional exponent
const NUMBER = '[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:e[+-]?\\d+)?';
// Accepts: 'none', or a number with an optional percentage or angle unit
const VALUE = `(none|${NUMBER}(?:%|deg|grad|rad|turn)?)`;
const ANGLE_UNIT = /(?:deg|grad|rad|turn)$/;

const colorRegex = new RegExp(
  `^${MODEL}\\s*\\(\\s*${VALUE}${SEP}${VALUE}${SEP}${VALUE}(?:${SEP}${VALUE})?\\s*\\)$`,
  'i',
);

export type ColorString =
  { hex: HEX; type: 'hex' | 'named' } | { parts: ExtractColorPartsReturn; type: ColorModelKey };

export type ExtractColorPartsReturn = {
  alpha?: number;
  model: ColorModelKey;
} & Record<string, number>;

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

  // Not rounded: the range check must see the value as written (360.000001 is out of range)
  return result;
}

/**
 * Parse CSS color function syntax (rgb, hsl, oklab, oklch).
 *
 * @param input - The trimmed CSS color string.
 * @returns An object with the color model and component values.
 */
function parseColorFunction(input: string): ExtractColorPartsReturn {
  const matches = colorRegex.exec(input);

  invariant(hasValidMatches(matches), MESSAGES.invalidCSS);

  // Function names, keywords, and units are ASCII case-insensitive (CSS Values 4)
  const tokens = matches.map(token => token?.toLowerCase());

  // Alpha as written: a percentage is divided by 100, a number is kept
  let alpha = 1;

  if (tokens[5]) {
    invariant(!ANGLE_UNIT.test(tokens[5]), MESSAGES.invalidCSS);
    const rawAlpha = tokens[5] === 'none' ? 0 : parseFloat(tokens[5]);

    alpha = tokens[5].endsWith('%') ? rawAlpha / 100 : rawAlpha;
  }

  const model = tokens[1] as ColorModelKey;
  const keys = COLOR_KEYS[model];

  // Parse values and convert percentages/angles for color models
  const parseValue = (value: string, index: number): number => {
    // Handle 'none' keyword - treated as 0 for rendering (CSS Color Level 4)
    if (value === 'none') {
      return 0;
    }

    // Handle hue values with angle units (HSL index 0, OkLCH index 2)
    const isHue = (model === 'hsl' && index === 0) || (model === 'oklch' && index === 2);

    if (isHue) {
      // <hue> is <number> | <angle>; percentages are not allowed (CSS Color 4)
      invariant(!value.endsWith('%'), MESSAGES.invalidCSS);

      return parseAngle(value);
    }

    // Angle units are only valid on hue
    invariant(!ANGLE_UNIT.test(value), MESSAGES.invalidCSS);

    const parsedValue = parseFloat(value);

    if (!value.includes('%')) {
      return parsedValue;
    }

    // Percentages scale to native units: RGB 100% = 255, OkLab/OkLCH L 100% = 1,
    // C 100% = 0.4, a/b ±100% = ±0.4 (scales, not caps). HSL S/L stay 0-100.
    if (model === 'rgb') {
      return (parsedValue * 255) / 100;
    }

    if ((model === 'oklab' || model === 'oklch') && index === 0) {
      return parseFloat((parsedValue / 100).toPrecision(15));
    }

    if ((model === 'oklch' && index === 1) || (model === 'oklab' && index > 0)) {
      return (parsedValue * 0.4) / 100;
    }

    return parsedValue;
  };

  const values = [parseValue(tokens[2], 0), parseValue(tokens[3], 1), parseValue(tokens[4], 2)];

  // Overflow (1e999) and unrecognized keywords parse to non-finite values
  invariant(values.every(Number.isFinite), MESSAGES.invalidRange);

  return {
    model,
    [keys[0]]: values[0],
    [keys[1]]: values[1],
    [keys[2]]: values[2],
    alpha: alpha !== 1 ? alpha : undefined,
  } as ExtractColorPartsReturn;
}

/**
 * Classify and parse a CSS color string: hex, named color, or color function.
 * The single entry point for color strings, so trimming and parsing rules live in one place.
 *
 * @param input - The CSS color string.
 * @returns The hex value for hex and named colors, or the parsed parts for color functions.
 */
export function parseColorString(input: string): ColorString {
  invariant(isString(input), MESSAGES.inputString);

  const value = trimCSSWhitespace(input);

  if (isNamedColor(value)) {
    return { type: 'named', hex: cssColors[value.toLowerCase() as CSSColor] as HEX };
  }

  if (isHex(value)) {
    // #rgba becomes #rrggbbaa, so stripping and re-appending a 2-digit alpha keeps it valid
    return { type: 'hex', hex: value.length === 5 ? formatHex(value) : value };
  }

  const parts = parseColorFunction(value);

  return { type: parts.model, parts };
}
