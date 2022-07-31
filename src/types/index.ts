/* eslint-disable typescript-sort-keys/interface */
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
  hex: string;
  hsl: HSL;
  rgb: RGB;
}

export type ColorTypes = 'hex' | 'hsl' | 'rgb';
export type ColorModels = 'hsl' | 'rgb';

export interface FormatOptions {
  alpha?: number;
  model?: ColorModels;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface Options {
  model?: ColorModels;
}

export interface PaletteOptions {
  lightness?: number;
  saturation?: number;
  size?: number;
  type?: string;
}

export type PlainObject = Record<string, any>;

type ReturnModel<T> = T extends 'rgb' ? RGB : HSL;

export type Return<T> = T extends 'rgb' | 'hsl' ? ReturnModel<T> : string;

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type RGBArray = [number, number, number];

export type Scheme =
  | 'analogous'
  | 'complementary'
  | 'rectangle'
  | 'split'
  | 'split-complementary'
  | 'square'
  | 'tetradic'
  | 'triadic';
