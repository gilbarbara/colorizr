export type ColorKeysTuple = [string, string, string];

export type ColorModel = HSL | LAB | LCH | RGB;

export type ColorModelKey = 'hsl' | 'oklab' | 'oklch' | 'rgb';

export type ColorModelKeys<TModel extends ColorModelKey> = TModel extends 'hsl'
  ? keyof Omit<HSL, 'alpha'>
  : TModel extends 'oklab'
    ? keyof Omit<LAB, 'alpha'>
    : TModel extends 'oklch'
      ? keyof Omit<LCH, 'alpha'>
      : TModel extends 'rgb'
        ? keyof Omit<RGB, 'alpha'>
        : never;
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

export type ColorTuple = [number, number, number];

export type ColorType = 'hex' | 'hsl' | 'oklab' | 'oklch' | 'rgb';

export type ColorTypeInput = ColorType | 'named';

export type ConverterParameters<TModel extends ColorModel> = TModel | ColorTuple;

export type HEX = `#${string}`;

export type PlainObject<T = any> = Record<string, T>;

export interface Analysis {
  brightnessDifference: number;
  colorDifference: number;
  compliant: number;
  contrast: number;
  largeAA: boolean;
  largeAAA: boolean;
  normalAA: boolean;
  normalAAA: boolean;
}

export interface Colors {
  /** The alpha/opacity value (0-1). */
  alpha: number;
  hex: HEX;
  hsl: HSL;
  oklab: LAB;
  oklch: LCH;
  rgb: RGB;
  type: ColorType;
}

export interface HSL {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  h: number;
  l: number;
  s: number;
}

export interface LAB {
  a: number;
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  b: number;
  l: number;
}

export interface LCH {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  c: number;
  h: number;
  l: number;
}

export interface RGB {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  b: number;
  g: number;
  r: number;
}
