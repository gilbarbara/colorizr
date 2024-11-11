import { ColorKeysTuple, ColorModelKey } from '~/types';

export const COLOR_KEYS: Record<ColorModelKey, ColorKeysTuple> = {
  hsl: ['h', 's', 'l'],
  oklab: ['l', 'a', 'b'],
  oklch: ['l', 'c', 'h'],
  rgb: ['r', 'g', 'b'],
};
export const COLOR_MODELS: ColorModelKey[] = ['hsl', 'oklab', 'oklch', 'rgb'];
export const DEG2RAD = Math.PI / 180;
export const LAB_TO_LMS = {
  l: [0.3963377773761749, 0.2158037573099136],
  m: [-0.1055613458156586, -0.0638541728258133],
  s: [-0.0894841775298119, -1.2914855480194092],
};
export const LRGB_TO_LMS = {
  l: [0.4122214708, 0.5363325363, 0.0514459929],
  m: [0.2119034982, 0.6806995451, 0.1073969566],
  s: [0.0883024619, 0.2817188376, 0.6299787005],
};
export const LSM_TO_LAB = {
  l: [0.2104542553, 0.793617785, 0.0040720468],
  a: [1.9779984951, 2.428592205, 0.4505937099],
  b: [0.0259040371, 0.7827717662, 0.808675766],
};
export const LSM_TO_RGB = {
  r: [4.0767416360759583, -3.3077115392580629, 0.2309699031821043],
  g: [-1.2684379732850315, 2.6097573492876882, -0.341319376002657],
  b: [-0.0041960761386756, -0.7034186179359362, 1.7076146940746117],
};
export const SRGB_TO_P3 = [
  [0.8224270476, 0.1775729524, 0],
  [0.0331008087, 0.9668991913, 0],
  [0.0170720188, 0.0723477973, 0.9105801839],
];
export const PRECISION = 5;
export const RAD2DEG = 180 / Math.PI;

export const MESSAGES = {
  alpha: 'amount must be a number between 0 and 1',
  hueRange: 'hue must be a number between 0 and 360',
  input: 'input is required',
  inputHex: 'input is required and must be a hex',
  inputNumber: 'input is required and must be a number',
  inputString: 'input is required and must be a string',
  invalid: 'invalid input',
  invalidCSS: 'invalid CSS string',
  left: 'left is required and must be a string',
  lightnessRange: 'lightness must be a number between 0 and 1',
  options: 'invalid options',
  right: 'right is required and must be a string',
  threshold: 'threshold must be a number between 0 and 255',
} as const;
