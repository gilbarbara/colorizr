import formatHex from '~/format-hex';
import { COLOR_KEYS, MESSAGES } from '~/modules/constants';
import { CSSColor, cssColors } from '~/modules/css-colors';
import { invariant } from '~/modules/invariant';
import { clamp, trimCSSWhitespace } from '~/modules/utils';
import {
  hasValidMatches,
  isHex,
  isHSL,
  isLAB,
  isLCH,
  isNamedColor,
  isRGB,
  isString,
} from '~/modules/validators';

import { ColorModelKey, HEX } from '~/types';

// Regex components for parsing CSS color strings
// CSS whitespace only: JavaScript's \s also matches other Unicode spaces, such as a non-breaking space
const WS = '[ \\t\\n\\r\\f]';
// CSS <number>: optional sign, digits with an optional fraction (or a leading '.'), optional exponent
const NUMBER = '[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:e[+-]?\\d+)?';
// Accepts: 'none', or a number with an optional percentage or angle unit
const VALUE_PATTERN = `none|${NUMBER}(?:%|deg|grad|rad|turn)?`;
const VALUE = `(${VALUE_PATTERN})`;
const VALUE_NC = `(?:${VALUE_PATTERN})`;
const ANGLE_UNIT = /(?:deg|grad|rad|turn)$/;

// Strict CSS Color 4 syntax, used to report whether a string is valid CSS as written.
// Modern: whitespace between channels, '/' only before alpha. rgba/hsla are aliases of rgb/hsl.
const modernRegex = new RegExp(
  `^(?:rgba?|hsla?|oklab|oklch)\\(${WS}*${VALUE_NC}${WS}+${VALUE_NC}${WS}+${VALUE_NC}(?:${WS}*/${WS}*${VALUE_NC})?${WS}*\\)$`,
  'i',
);

// Legacy: commas between every value, rgb/hsl only
const legacyRegex = new RegExp(
  `^(rgba?|hsla?)\\(${WS}*${VALUE}${WS}*,${WS}*${VALUE}${WS}*,${WS}*${VALUE}(?:${WS}*,${WS}*${VALUE})?${WS}*\\)$`,
  'i',
);

// Lenient syntax, used for parsing: any of ',', '/' or whitespace between values,
// and an 'a' suffix on any function name. Values follow the same CSS <number> grammar.
const LENIENT_SEP = '(?:\\s*[,/]\\s*|\\s+)';
const lenientRegex = new RegExp(
  `^((?:rgb|hsl|oklab|oklch)a?)\\s*\\(\\s*${VALUE}${LENIENT_SEP}${VALUE}${LENIENT_SEP}${VALUE}(?:${LENIENT_SEP}${VALUE})?\\s*\\)$`,
  'i',
);

// Range checks shared with the object type guards, so strings and objects follow one rule
const rangeGuards: Record<ColorModelKey, (input: unknown) => boolean> = {
  hsl: isHSL,
  oklab: isLAB,
  oklch: isLCH,
  rgb: isRGB,
};

export type ColorString =
  | { hex: HEX; type: 'hex' | 'named' }
  | {
      /** Whether every value, as written, is within the range of its type guard */
      inRange: boolean;
      parts: ExtractColorPartsReturn;
      /** Whether the string follows the CSS Color 4 syntax (the parser also accepts looser forms) */
      strictSyntax: boolean;
      type: ColorModelKey;
    };

export type ExtractColorPartsReturn = {
  alpha?: number;
  model: ColorModelKey;
} & Record<string, number>;

/**
 * Check whether a color function follows the CSS Color 4 syntax: modern (whitespace, '/' before alpha)
 * or legacy (commas; no 'none', rgb channels all numbers or all percentages,
 * hsl saturation and lightness as percentages).
 *
 * @param input - The trimmed CSS color string.
 * @returns True if the string is valid CSS as written.
 */
function isStrictSyntax(input: string): boolean {
  if (modernRegex.test(input)) {
    return true;
  }

  const matches = legacyRegex.exec(input);

  if (!matches) {
    return false;
  }

  const tokens = matches.map(token => token?.toLowerCase());
  const channels = tokens.slice(2, 5);

  if (tokens.slice(2).includes('none')) {
    return false;
  }

  if (tokens[1].startsWith('rgb')) {
    const percentages = channels.filter(channel => channel.endsWith('%')).length;

    return percentages === 0 || percentages === 3;
  }

  return channels[1].endsWith('%') && channels[2].endsWith('%');
}

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
 * @returns The parsed parts, whether every value was in range as written, and whether the syntax is strict CSS.
 */
function parseColorFunction(input: string): {
  inRange: boolean;
  parts: ExtractColorPartsReturn;
  strictSyntax: boolean;
} {
  const matches = lenientRegex.exec(input);

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

  // The 'a' suffix is an alias (rgba, hsla), or tolerated by the lenient syntax (oklaba, oklcha)
  const model = tokens[1].replace(/a$/, '') as ColorModelKey;
  const keys = COLOR_KEYS[model];

  // Parse values as written: percentages and angles convert to native units, nothing is clamped
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
      return percentToFraction(value);
    }

    if ((model === 'oklch' && index === 1) || (model === 'oklab' && index > 0)) {
      return (parsedValue * 0.4) / 100;
    }

    return parsedValue;
  };

  const values = [parseValue(tokens[2], 0), parseValue(tokens[3], 1), parseValue(tokens[4], 2)];

  // Overflow (1e999) and unrecognized keywords parse to non-finite values
  invariant(values.every(Number.isFinite), MESSAGES.invalidRange);

  const color = { [keys[0]]: values[0], [keys[1]]: values[1], [keys[2]]: values[2] };

  return {
    inRange: rangeGuards[model]({ ...color, alpha }),
    strictSyntax: isStrictSyntax(input),
    parts: { model, ...color, alpha: alpha !== 1 ? alpha : undefined } as ExtractColorPartsReturn,
  };
}

/**
 * Convert a CSS percentage to a fraction exactly, by shifting the decimal exponent instead of dividing.
 * Dividing by 100 adds float noise (33.3 / 100 = 0.33299999999999996), and rounding it away
 * would hide values just past a range limit (100.00000000000004% must stay above 1).
 *
 * @param value - The percentage token, such as '33.3%' or '1e2%'.
 * @returns The fraction, such as 0.333 or 1.
 */
function percentToFraction(value: string): number {
  const [mantissa, exponent = '0'] = value.slice(0, -1).split('e');

  return Number(`${mantissa}e${Number(exponent) - 2}`);
}

/**
 * Normalize out-of-range values the way CSS Color 4 resolves them:
 * channels and alpha are clamped to their ranges, hue wraps to [0, 360),
 * and negative OkLCH chroma becomes 0. OkLab a/b are unbounded.
 *
 * @param parts - The parsed parts, as written.
 * @returns The parts with every value in range.
 */
export function normalizeColorParts(parts: ExtractColorPartsReturn): ExtractColorPartsReturn {
  const { alpha, model, ...color } = parts;

  // `hue % 360` keeps in-range values exact; adding 360 to every hue would introduce float error
  const wrapHue = (hue: number) => {
    const remainder = hue % 360;

    return remainder < 0 ? remainder + 360 : remainder;
  };

  let normalized: Record<string, number>;

  switch (model) {
    case 'hsl': {
      normalized = { h: wrapHue(color.h), s: clamp(color.s), l: clamp(color.l) };
      break;
    }
    case 'oklab': {
      normalized = { l: clamp(color.l, 0, 1), a: color.a, b: color.b };
      break;
    }
    case 'oklch': {
      normalized = { l: clamp(color.l, 0, 1), c: Math.max(color.c, 0), h: wrapHue(color.h) };
      break;
    }
    default: {
      normalized = {
        r: clamp(color.r, 0, 255),
        g: clamp(color.g, 0, 255),
        b: clamp(color.b, 0, 255),
      };
    }
  }

  const normalizedAlpha = alpha === undefined ? undefined : clamp(alpha, 0, 1);

  return {
    model,
    ...normalized,
    alpha: normalizedAlpha !== 1 ? normalizedAlpha : undefined,
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

  const { inRange, parts, strictSyntax } = parseColorFunction(value);

  return { type: parts.model, parts, inRange, strictSyntax };
}
