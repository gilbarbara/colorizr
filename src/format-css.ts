import { MESSAGES, PRECISION } from '~/modules/constants';
import { convertAlphaToHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { restrictValues, round } from '~/modules/utils';
import { isHex, isHSL, isLAB, isLCH, isValidColorModel } from '~/modules/validators';

import * as converters from '~/converters';
import { Alpha, ColorModel, ColorType, HEX, HSL } from '~/types';

export interface FormatOptions {
  alpha?: Alpha;
  /**
   * The output color type.
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
   * oklab and oklch always use space as a separator.
   * @default ' '
   */
  separator?: string;
}

export default function formatCSS<T extends ColorModel | HEX>(
  input: T,
  options: FormatOptions = {},
): string {
  invariant(isHex(input) || isValidColorModel(input), MESSAGES.invalid);

  const { alpha, format = 'hex', precision = PRECISION, separator: baseSeparator = ' ' } = options;

  let value: HSL;

  if (isHex(input)) {
    value = converters.hex2hsl(input);
  } else if (isHSL(input)) {
    value = input;
  } else if (isLAB(input)) {
    value = converters.oklab2hsl(input);
  } else if (isLCH(input)) {
    value = converters.oklch2hsl(input);
  } else {
    value = converters.rgb2hsl(input);
  }

  const opacity = alpha && alpha !== 1 ? `${round(alpha * 100)}%` : null;
  let params = [];
  let separator = baseSeparator;

  switch (format) {
    case 'hsl': {
      const { h, s, l } = value;

      params = [h, `${s}%`, `${l}%`];
      break;
    }
    case 'oklab': {
      separator = ' ';
      const { l, a, b } = restrictValues(converters.hsl2oklab(value), precision);

      params = [`${round(l * 100, precision)}%`, a, b];
      break;
    }
    case 'oklch': {
      separator = ' ';
      const { l, c, h } = restrictValues(converters.hsl2oklch(value), precision);

      params = [`${round(l * 100, precision)}%`, c, h];
      break;
    }
    case 'rgb': {
      const { r, g, b } = converters.hsl2rgb(value);

      params = [r, g, b];
      break;
    }
    default: {
      const hex = converters.hsl2hex(value);

      if (alpha && alpha !== 1) {
        return `${hex}${convertAlphaToHex(alpha)}`;
      }

      return hex;
    }
  }

  return `${format}(${params.join(separator)}${opacity ? ` / ${opacity}` : ''})`;
}
