import * as converters from '~/converters';
import {
  addAlpha,
  convertAlphaToHex,
  extractAlphaFromHex,
  removeAlphaFromHex,
} from '~/modules/alpha';
import { ExtractColorPartsReturn, parseColorString } from '~/modules/color-string';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';

import {
  ColorModel,
  ColorModelKey,
  ColorReturn,
  ColorTuple,
  ColorType,
  HEX,
  HSL,
  LAB,
  LCH,
  RGB,
} from '~/types';

type ToHexFn = (input: ColorTuple) => HEX;
type ToHslFn = (input: ColorTuple) => HSL;
type ToOklabFn = (input: ColorTuple) => LAB;
type ToOklchFn = (input: ColorTuple) => LCH;
type ToRgbFn = (input: ColorTuple) => RGB;

const toHslConverters: Partial<Record<ColorModelKey, ToHslFn>> = {
  oklab: converters.oklab2hsl,
  oklch: converters.oklch2hsl,
  rgb: converters.rgb2hsl,
};

const toOklabConverters: Partial<Record<ColorModelKey, ToOklabFn>> = {
  hsl: converters.hsl2oklab,
  oklch: converters.oklch2oklab,
  rgb: converters.rgb2oklab,
};

const toOklchConverters: Partial<Record<ColorModelKey, ToOklchFn>> = {
  hsl: converters.hsl2oklch,
  oklab: converters.oklab2oklch,
  rgb: converters.rgb2oklch,
};

const toRgbConverters: Partial<Record<ColorModelKey, ToRgbFn>> = {
  hsl: converters.hsl2rgb,
  oklab: converters.oklab2rgb,
  oklch: converters.oklch2rgb,
};

const toHexConverters: Record<ColorModelKey, ToHexFn> = {
  hsl: converters.hsl2hex,
  oklab: converters.oklab2hex,
  oklch: converters.oklch2hex,
  rgb: converters.rgb2hex,
};

// Hex-to-format converters lookup
const fromHexConverters: Record<Exclude<ColorType, 'hex'>, (input: HEX) => ColorModel> = {
  hsl: converters.hex2hsl,
  oklab: converters.hex2oklab,
  oklch: converters.hex2oklch,
  rgb: converters.hex2rgb,
};

// Model-to-format converter tables lookup
const converterTables: Record<
  Exclude<ColorType, 'hex'>,
  Partial<Record<ColorModelKey, ToHslFn | ToOklabFn | ToOklchFn | ToRgbFn>>
> = {
  hsl: toHslConverters,
  oklab: toOklabConverters,
  oklch: toOklchConverters,
  rgb: toRgbConverters,
};

function convertFromCSS(
  parts: ExtractColorPartsReturn,
  output: ColorType,
): HEX | HSL | LAB | LCH | RGB {
  const { alpha, model, ...color } = parts;

  const colorTuple = Object.values(color) as ColorTuple;

  if (output === 'hex') {
    const alphaPrefix = alpha !== undefined ? convertAlphaToHex(alpha) : '';

    return `${toHexConverters[model](colorTuple)}${alphaPrefix}` as HEX;
  }

  const converter = converterTables[output]?.[model];

  // When converter is undefined, model matches output format, so color already has correct shape
  return addAlpha(
    converter ? converter(colorTuple) : (color as unknown as HSL | LAB | LCH | RGB),
    alpha,
  );
}

function convertFromHex(value: HEX, output: ColorType): HEX | HSL | LAB | LCH | RGB {
  const alpha = extractAlphaFromHex(value);

  if (output === 'hex') {
    return `${removeAlphaFromHex(value)}${alpha !== 1 ? convertAlphaToHex(alpha) : ''}` as HEX;
  }

  return addAlpha(fromHexConverters[output](value), alpha);
}

/**
 * Parse a CSS color string and optionally convert to a specific format.
 *
 * @param input - The CSS color string.
 * @param format - Optional output color format.
 * @returns The parsed color in the specified format.
 */
export default function parseCSS<T extends ColorType>(input: string, format?: T): ColorReturn<T> {
  const result = parseColorString(input);

  if ('hex' in result) {
    return convertFromHex(result.hex, format ?? 'hex') as ColorReturn<T>;
  }

  invariant(result.inRange, MESSAGES.invalidRange);

  return convertFromCSS(result.parts, format ?? result.type) as ColorReturn<T>;
}
