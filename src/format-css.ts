/* eslint-disable sonarjs/no-redundant-assignments */
import * as converters from '~/converters';
import { convertAlphaToHex, normalizeAlpha, removeAlphaFromHex } from '~/modules/alpha';
import { MESSAGES, PRECISION } from '~/modules/constants';
import { CSSColor, cssColors } from '~/modules/css-colors';
import { invariant } from '~/modules/invariant';
import { restrictValues, round } from '~/modules/utils';
import {
  isHex,
  isHSL,
  isLAB,
  isLCH,
  isNamedColor,
  isNumber,
  isRGB,
  isString,
  isValidColorModel,
} from '~/modules/validators';

import { ColorModel, ColorReturn, ColorType, ColorValue } from '~/types';

export interface FormatCSSOptions {
  /**
   * The alpha value of the color (0-1).
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
  const normalizedAlpha = isNumber(alpha) ? normalizeAlpha(alpha) : undefined;
  const opacity =
    normalizedAlpha !== undefined && normalizedAlpha !== 1
      ? `${round(normalizedAlpha * 100)}%`
      : null;
  let params = [];
  let separator = baseSeparator;

  switch (colorFormat) {
    case 'hsl': {
      const { h, s, l } = getColorValue(input, 'hsl');

      params = [h, `${s}%`, `${l}%`];
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

      params = [`${round(l * 100, precision, false)}%`, c, c === 0 ? 'none' : h];
      break;
    }
    case 'rgb': {
      const { r, g, b } = getColorValue(input, 'rgb');

      params = [r, g, b];
      break;
    }
    default: {
      const hex = removeAlphaFromHex(getColorValue(input, 'hex'));

      if (normalizedAlpha !== undefined && normalizedAlpha !== 1) {
        return `${hex}${convertAlphaToHex(normalizedAlpha)}`;
      }

      return hex;
    }
  }

  return `${colorFormat}(${params.join(separator)}${opacity ? ` / ${opacity}` : ''})`;
}
