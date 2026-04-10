import * as converters from '~/converters';
import extractColorParts from '~/extract-color-parts';
import formatCSS, { FormatCSSOptions } from '~/format-css';
import {
  convertAlphaToHex,
  extractAlphaFromHex,
  normalizeAlpha,
  removeAlphaFromHex,
} from '~/modules/alpha';
import { CSSColor, cssColors } from '~/modules/css-colors';
import { clamp, normalizeOkLightness } from '~/modules/utils';
import {
  isHex,
  isHSL,
  isLAB,
  isLCH,
  isNamedColor,
  isPlainObject,
  isRGB,
} from '~/modules/validators';

import { ColorModelKey, ColorTuple, ColorType, ColorValue, HEX, HSL, LAB, LCH, RGB } from '~/types';

type ModelConverterFn = (input: ColorTuple) => ColorValue;

export type ColorInput = string | ParsedColor | HSL | LAB | LCH | RGB;

export interface ParsedColor {
  readonly __parsed: true;
  readonly alpha: number;
  readonly hex: HEX;
  readonly hsl: HSL;
  readonly oklab: LAB;
  readonly oklch: LCH;
  readonly rgb: RGB;
  toCSS(options?: FormatCSSOptions): string;
  readonly type: ColorType;
}

// model → hex converters (accepts ColorTuple)
const toHexConverters: Record<ColorModelKey, ModelConverterFn> = {
  hsl: converters.hsl2hex,
  oklab: converters.oklab2hex,
  oklch: converters.oklch2hex,
  rgb: converters.rgb2hex,
};

// hex → model converters (accepts HEX string)
const fromHexConverters: Record<string, (input: HEX) => HSL | LAB | LCH | RGB> = {
  hsl: converters.hex2hsl,
  oklab: converters.hex2oklab,
  oklch: converters.hex2oklch,
  rgb: converters.hex2rgb,
};

// model → model converters (accepts ColorTuple)
const modelConverters: Record<ColorModelKey, Partial<Record<ColorModelKey, ModelConverterFn>>> = {
  hsl: {
    oklab: converters.oklab2hsl,
    oklch: converters.oklch2hsl,
    rgb: converters.rgb2hsl,
  },
  oklab: {
    hsl: converters.hsl2oklab,
    oklch: converters.oklch2oklab,
    rgb: converters.rgb2oklab,
  },
  oklch: {
    hsl: converters.hsl2oklch,
    oklab: converters.oklab2oklch,
    rgb: converters.rgb2oklch,
  },
  rgb: {
    hsl: converters.hsl2rgb,
    oklab: converters.oklab2rgb,
    oklch: converters.oklch2rgb,
  },
};

class ParsedColorImpl implements ParsedColor {
  readonly __parsed = true;
  readonly type: ColorType;
  readonly alpha: number;

  private readonly _sourceValue: ColorValue;
  private _cache: Partial<Record<ColorType, ColorValue>> = {};

  constructor(type: ColorType, value: ColorValue, alpha: number) {
    this.type = type;
    this.alpha = alpha;
    this._sourceValue = value;
    this._cache[type] = value;
  }

  get hex(): HEX {
    return this._getAs('hex') as HEX;
  }

  get hsl(): HSL {
    return this._getAs('hsl') as HSL;
  }

  get rgb(): RGB {
    return this._getAs('rgb') as RGB;
  }

  get oklab(): LAB {
    return this._getAs('oklab') as LAB;
  }

  get oklch(): LCH {
    return this._getAs('oklch') as LCH;
  }

  toCSS(options?: FormatCSSOptions): string {
    const format = options?.format ?? this.type;
    const alpha = options?.alpha ?? (this.alpha < 1 ? this.alpha : undefined);

    if (format === 'hex') {
      const hex = removeAlphaFromHex(this.hex);

      if (alpha !== undefined && alpha < 1) {
        return `${hex}${convertAlphaToHex(alpha)}`;
      }

      return hex;
    }

    return formatCSS(this[format], { ...options, format, alpha });
  }

  private _getAs(target: ColorType): ColorValue {
    if (this._cache[target]) {
      return this._cache[target];
    }

    let result: ColorValue;

    if (this.type === 'hex') {
      result =
        target === 'hex' ? this._sourceValue : fromHexConverters[target](this._sourceValue as HEX);
    } else if (target === 'hex') {
      const tuple = Object.values(this._sourceValue) as ColorTuple;

      result = toHexConverters[this.type as ColorModelKey](tuple);

      if (this.alpha < 1) {
        result = `${result}${convertAlphaToHex(this.alpha)}` as HEX;
      }
    } else {
      const converter = modelConverters[target]?.[this.type as ColorModelKey];

      if (!converter) {
        // Same-type lookups are served from cache; fallback via hex if invariant breaks
        result = fromHexConverters[target](this.hex);
      } else {
        const tuple = Object.values(this._sourceValue) as ColorTuple;

        result = converter(tuple);
      }
    }

    this._cache[target] = result;

    return result;
  }
}

export function isParsedColor(input: unknown): input is ParsedColor {
  return (
    typeof input === 'object' && input !== null && '__parsed' in input && input.__parsed === true
  );
}

export function resolveColor(input: ColorInput): ParsedColor {
  if (isParsedColor(input)) {
    return input;
  }

  if (isPlainObject(input)) {
    const { alpha: rawAlpha = 1 } = input;
    const alpha = clamp(normalizeAlpha(rawAlpha), 0, 1);

    if (isHSL(input)) {
      return new ParsedColorImpl(
        'hsl',
        { h: clamp(input.h, 0, 360), s: clamp(input.s), l: clamp(input.l) },
        alpha,
      );
    }

    if (isRGB(input)) {
      return new ParsedColorImpl(
        'rgb',
        { r: clamp(input.r, 0, 255), g: clamp(input.g, 0, 255), b: clamp(input.b, 0, 255) },
        alpha,
      );
    }

    if (isLAB(input)) {
      return new ParsedColorImpl('oklab', { l: input.l, a: input.a, b: input.b }, alpha);
    }

    if (isLCH(input)) {
      return new ParsedColorImpl('oklch', { l: input.l, c: input.c, h: input.h }, alpha);
    }
  }

  const value = isNamedColor(input) ? cssColors[input.toLowerCase() as CSSColor] : input;

  if (isHex(value)) {
    const alpha = extractAlphaFromHex(value);
    const hex = removeAlphaFromHex(value);

    return new ParsedColorImpl('hex', hex, alpha);
  }

  const parts = extractColorParts(value);
  const { alpha, model, ...color } = parts;

  const colorValue = (['oklab', 'oklch'].includes(model)
    ? normalizeOkLightness(color as unknown as { l: number })
    : color) as unknown as HSL | LAB | LCH | RGB;
  const colorType: ColorType = model;

  return new ParsedColorImpl(colorType, colorValue, alpha ?? 1);
}
