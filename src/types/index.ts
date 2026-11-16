/** The three channel keys of a color model. */
export type ColorKeysTuple = [string, string, string];

/** A color object in any supported model. */
export type ColorModel = HSL | LAB | LCH | RGB;

/** The supported color models. */
export type ColorModelKey = 'hsl' | 'oklab' | 'oklch' | 'rgb';

/** The channel keys of a color model, without alpha. */
export type ColorModelKeys<TModel extends ColorModelKey> = TModel extends 'hsl'
  ? keyof Omit<HSL, 'alpha'>
  : TModel extends 'oklab'
    ? keyof Omit<LAB, 'alpha'>
    : TModel extends 'oklch'
      ? keyof Omit<LCH, 'alpha'>
      : TModel extends 'rgb'
        ? keyof Omit<RGB, 'alpha'>
        : never;
/** The value type for a color format: a hex string or the matching color object. */
export type ColorReturn<T extends ColorType> = T extends 'hex'
  ? HEX
  : T extends 'hsl'
    ? HSL
    : T extends 'oklab'
      ? LAB
      : T extends 'oklch'
        ? LCH
        : T extends 'rgb'
          ? RGB
          : never;

/** Three channel values, in the model's key order. */
export type ColorTuple = [number, number, number];

/** The supported color formats. */
export type ColorType = 'hex' | 'hsl' | 'oklab' | 'oklch' | 'rgb';

/** The color types `getColorType` detects, including named colors. */
export type ColorTypeInput = ColorType | 'named';

/** A color object or a hex string. */
export type ColorValue = ColorModel | HEX;

/** Converter input: a color object or a tuple of its channels. */
export type ConverterParameters<TModel extends ColorModel> = TModel | ColorTuple;

/** A hex color string. */
export type HEX = `#${string}`;

/** The result of `compare`. */
export interface Analysis {
  /** Brightness difference (0-255); 125 or more passes. */
  brightnessDifference: number;
  /** Color difference (0-765); 500 or more passes. */
  colorDifference: number;
  /** How many of the brightness and color difference checks pass (0-2). */
  compliant: number;
  /** WCAG 2 contrast ratio (1-21). */
  contrast: number;
  /** Contrast is at least 3, for large text (WCAG AA). */
  largeAA: boolean;
  /** Contrast is at least 4.5, for large text (WCAG AAA). */
  largeAAA: boolean;
  /** Contrast is at least 4.5, for normal text (WCAG AA). */
  normalAA: boolean;
  /** Contrast is at least 7, for normal text (WCAG AAA). */
  normalAAA: boolean;
}

/** An HSL color: hue 0-360, saturation and lightness 0-100. */
export interface HSL {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  h: number;
  l: number;
  s: number;
}

/** An OkLab color: lightness 0-1, a and b unbounded (typically within ±0.4). */
export interface LAB {
  a: number;
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  b: number;
  l: number;
}

/** An OkLCH color: lightness 0-1, chroma 0 or more (typically up to 0.4), hue 0-360. */
export interface LCH {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  c: number;
  h: number;
  l: number;
}

/** An RGB color: channels 0-255. */
export interface RGB {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  b: number;
  g: number;
  r: number;
}
