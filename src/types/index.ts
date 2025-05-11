/* A number between 0 and 1 */
export type Alpha = number;
/* A number between 0 and 100 */
export type Amount = number;
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

export type ColorTokens = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type ColorTuple = [number, number, number];

export type ColorType = 'hex' | 'hsl' | 'oklab' | 'oklch' | 'rgb';

export type ConverterParameters<TModel extends ColorModel> = TModel | ColorTuple;

/* A number between 0 and 360 */
export type Degrees = number;

export type HEX = `#${string}`;

/*
Color types
 */

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
  alpha: Alpha;
  hex: HEX;
  hsl: HSL;
  oklab: LAB;
  oklch: LCH;
  rgb: RGB;
  type: ColorType;
}

export interface HSL {
  alpha?: Alpha;
  h: number;
  l: number;
  s: number;
}

export interface LAB {
  a: number;
  alpha?: Alpha;
  b: number;
  l: number;
}

export interface LCH {
  alpha?: Alpha;
  c: number;
  h: number;
  l: number;
}

export interface RGB {
  alpha?: Alpha;
  b: number;
  g: number;
  r: number;
}
