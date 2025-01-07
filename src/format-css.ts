import { MESSAGES, PRECISION } from '~/modules/constants';
import { CSSColor, cssColors } from '~/modules/css-colors';
import { convertAlphaToHex, removeAlphaFromHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { restrictValues, round } from '~/modules/utils';
import {
  isHex,
  isHSL,
  isLAB,
  isLCH,
  isNamedColor,
  isRGB,
  isString,
  isValidColorModel,
} from '~/modules/validators';

import * as converters from '~/converters';
import extractColorParts from '~/extract-color-parts';
import { Alpha, ColorModel, ColorReturn, ColorType, HEX } from '~/types';

export interface FormatCSSOptions {
  /**
   * The alpha value of the color.
   */
  alpha?: Alpha;
  /**
   * Output color format.
   * @default 'hex'
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

  if (isString(input)) {
    return extractColorParts(input).model;
  } else if (isHSL(input)) {
    return 'hsl';
  } else if (isLAB(input)) {
    return 'oklab';
  } else if (isLCH(input)) {
    return 'oklch';
  } else if (isRGB(input)) {
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

  const converterKey = `${from}2${output}` as keyof typeof converters; // Retrieve the converter function dynamically
  const converter = (converters as Record<string, (x: any) => any>)[converterKey];

  if (!converter) {
    throw new Error(`Converter not found for ${from} to ${output}`);
  }

  switch (from) {
    case 'hex': {
      if (output === 'hex') {
        return value as ColorReturn<TOutput>;
      }

      return converter(value);
    }
    case 'hsl': {
      if (output === 'hsl') {
        return value as ColorReturn<TOutput>;
      }

      return converter(value);
    }
    case 'oklab': {
      if (output === 'oklab') {
        return value as ColorReturn<TOutput>;
      }

      return converter(value);
    }
    case 'oklch': {
      if (output === 'oklch') {
        return value as ColorReturn<TOutput>;
      }

      return converter(value);
    }
    default: {
      if (output === 'rgb') {
        return value as ColorReturn<TOutput>;
      }

      return converter(value);
    }
  }
}

export default function formatCSS<T extends ColorModel | HEX>(
  input: T,
  options: FormatCSSOptions = {},
): string {
  invariant(isHex(input) || isValidColorModel(input), MESSAGES.invalid);

  const { alpha, format = 'hex', precision = PRECISION, separator: baseSeparator = ' ' } = options;

  const opacity = alpha && alpha !== 1 ? `${round(alpha * 100)}%` : null;
  let params = [];
  let separator = baseSeparator;

  switch (format) {
    case 'hsl': {
      const { h, s, l } = getColorValue(input, 'hsl');

      params = [h, `${s}%`, `${l}%`];
      break;
    }
    case 'oklab': {
      separator = ' ';
      const { l, a, b } = restrictValues(getColorValue(input, 'oklab'), precision);

      params = [`${round(l * 100, precision)}%`, a, b];
      break;
    }
    case 'oklch': {
      separator = ' ';
      const { l, c, h } = restrictValues(getColorValue(input, 'oklch'), precision);

      params = [`${round(l * 100, precision)}%`, c, h];
      break;
    }
    case 'rgb': {
      const { r, g, b } = getColorValue(input, 'rgb');

      params = [r, g, b];
      break;
    }
    default: {
      const hex = removeAlphaFromHex(getColorValue(input, 'hex'));

      if (alpha && alpha !== 1) {
        return `${hex}${convertAlphaToHex(alpha)}`;
      }

      return hex;
    }
  }

  return `${format}(${params.join(separator)}${opacity ? ` / ${opacity}` : ''})`;
}
