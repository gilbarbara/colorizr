/* eslint-disable sonarjs/no-redundant-assignments */
import * as converters from '~/converters';
import { addAlphaToHex, extractAlphaFromHex, removeAlphaFromHex } from '~/modules/alpha';
import { MESSAGES, PRECISION } from '~/modules/constants';
import { CSSColor, cssColors } from '~/modules/css-colors';
import { invariant } from '~/modules/invariant';
import { clamp, restrictValues, round } from '~/modules/utils';
import {
  isHex,
  isHSL,
  isLAB,
  isLCH,
  isNamedColor,
  isNumber,
  isNumberInRange,
  isPrecision,
  isRGB,
  isString,
  isValidColorModel,
} from '~/modules/validators';

import { ColorModel, ColorReturn, ColorType, ColorValue } from '~/types';

/** Options for `formatCSS`. */
export interface FormatCSSOptions {
  /**
   * The alpha value of the color (0-1).
   * Overrides the input's alpha; 1 removes it.
   */
  alpha?: number;
  /**
   * Output color format.
   */
  format?: ColorType;
  /**
   * The number of digits of the output.
   * @default 5
   */
  precision?: number;
  /**
   * The separator between the values.
   *
   * oklab and oklch always use space as a separator.
   * With a comma separator, alpha follows a comma (legacy syntax) instead of '/'.
   * @default ' '
   */
  separator?: string;
}

function getColorModel<T extends ColorModel | string>(input: T): ColorType {
  if (isHex(input) || isNamedColor(input)) {
    return 'hex';
  }

  if (isHSL(input)) {
    return 'hsl';
  }

  if (isLAB(input)) {
    return 'oklab';
  }

  if (isLCH(input)) {
    return 'oklch';
  }

  if (isRGB(input)) {
    return 'rgb';
  }

  throw new Error(MESSAGES.invalid);
}

function getColorValue<TInput extends ColorModel | string, TOutput extends ColorType>(
  input: TInput,
  output: TOutput,
): ColorReturn<TOutput> {
  const value = isNamedColor(input) ? cssColors[input.toLowerCase() as CSSColor] : input;
  const from = getColorModel(value);

  if (from === output) {
    return value as ColorReturn<TOutput>;
  }

  const converterKey = `${from}2${output}` as keyof typeof converters;
  const converter = (converters as Record<string, (x: any) => any>)[converterKey];

  if (!converter) {
    throw new Error(`Converter not found for ${from} to ${output}`);
  }

  return converter(value);
}

/**
 * Format a color model to a CSS color string.
 * The input's alpha is kept unless the `alpha` option overrides it.
 *
 * @param input - The color model or hex string.
 * @param formatOrOptions - Output format or formatting options object.
 * @returns The formatted CSS color string.
 */
export default function formatCSS<T extends ColorValue>(
  input: T,
  formatOrOptions?: ColorType | FormatCSSOptions,
): string {
  invariant(isHex(input) || isValidColorModel(input), MESSAGES.invalid);

  const {
    alpha,
    format,
    precision = PRECISION,
    separator: baseSeparator = ' ',
  } = isString(formatOrOptions, false) ? { format: formatOrOptions } : (formatOrOptions ?? {});

  const colorFormat = format || getColorModel(input);

  invariant(alpha === undefined || isNumberInRange(alpha, 0, 1), MESSAGES.alpha);
  // Significant digits: 0 rounds every channel away
  invariant(isPrecision(precision, 1), MESSAGES.precisionCSS);

  const inputAlpha = isHex(input) ? extractAlphaFromHex(input) : input.alpha;
  const normalizedAlpha = isNumber(alpha) ? alpha : inputAlpha;
  const opacity =
    normalizedAlpha !== undefined && normalizedAlpha !== 1
      ? `${round(normalizedAlpha * 100)}%`
      : null;
  let params = [];
  let separator = baseSeparator;

  switch (colorFormat) {
    case 'hsl': {
      const { h, s, l } = getColorValue(input, 'hsl');

      // Significant-digit rounding can carry past the range (355 → 400, 255 → 260 at low precision)
      params = [
        clamp(round(h, precision, false), 0, 360),
        `${round(s, precision, false)}%`,
        `${round(l, precision, false)}%`,
      ];
      break;
    }
    case 'oklab': {
      separator = ' ';
      const { l, a, b } = restrictValues(getColorValue(input, 'oklab'), precision, false);

      params = [`${round(l * 100, precision, false)}%`, a, b];
      break;
    }
    case 'oklch': {
      separator = ' ';
      const { l, c, h } = restrictValues(getColorValue(input, 'oklch'), precision, false);

      params = [`${round(l * 100, precision, false)}%`, c, c === 0 ? 'none' : clamp(h, 0, 360)];
      break;
    }
    case 'rgb': {
      const { r, g, b } = getColorValue(input, 'rgb');

      params = [r, g, b].map(value => clamp(round(value, precision, false), 0, 255));
      break;
    }
    default: {
      const hex = getColorValue(input, 'hex');

      return normalizedAlpha === undefined
        ? removeAlphaFromHex(hex)
        : addAlphaToHex(hex, normalizedAlpha);
    }
  }

  // Legacy (comma) syntax puts alpha after a comma; modern syntax puts it after '/'
  const alphaSeparator = separator.trim() === ',' ? separator : ' / ';

  return `${colorFormat}(${params.join(separator)}${opacity ? `${alphaSeparator}${opacity}` : ''})`;
}
