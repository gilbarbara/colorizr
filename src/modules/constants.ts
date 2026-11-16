import { ColorKeysTuple, ColorModelKey } from '~/types';

/** Channel keys for each color model, in order. */
export const COLOR_KEYS: Record<ColorModelKey, ColorKeysTuple> = {
  hsl: ['h', 's', 'l'],
  oklab: ['l', 'a', 'b'],
  oklch: ['l', 'c', 'h'],
  rgb: ['r', 'g', 'b'],
};

/** Matrix from cube-rooted LMS to OkLab. */
export const CLMS_TO_OKLAB: number[][] = [
  [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.4285922420485799, 0.450593709617411],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774],
];

/** Multiply degrees by this to get radians. */
export const DEG2RAD = Math.PI / 180;

/** Matrix from LMS (cone response) to linear sRGB. */
export const LMS_TO_LRGB: number[][] = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.707614701],
];

/** Matrix from linear sRGB to LMS (cone response). */
export const LRGB_TO_LMS: number[][] = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
];

/** Matrix from OkLab to cube-rooted LMS. */
export const OKLAB_TO_CLMS: number[][] = [
  [1.0, 0.3963377773761749, 0.2158037573099136],
  [1.0, -0.1055613458156586, -0.0638541728258133],
  [1.0, -0.0894841775298119, -1.2914855480194092],
];

/** Matrix from linear Display P3 to linear sRGB. */
export const P3_TO_SRGB: number[][] = [
  [1.2249401762805601, -0.22494017628055996, 0],
  [-0.042056954709688121, 1.0420569547096883, 0],
  [-0.019637554590334422, -0.078636045550631792, 1.0982736001409665],
];

/** Matrix from linear Display P3 to CIE XYZ (D65). */
export const P3_TO_XYZ: number[][] = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.22897456406974884, 0.6917385218365064, 0.079286914093745],
  [0.0, 0.04511338185890264, 1.043944368900976],
];

/** Matrix from linear sRGB to linear Display P3. */
export const SRGB_TO_P3: number[][] = [
  [0.8224270476, 0.1775729524, 0],
  [0.0331008087, 0.9668991913, 0],
  [0.0170720188, 0.0723477973, 0.9105801839],
];

/** Matrix from CIE XYZ (D65) to linear sRGB. */
export const XYZ_TO_SRGB: number[][] = [
  [3.2409699419045226, -1.5373831775700939, -0.4986107602930034],
  [-0.9692436362808796, 1.8759675015077202, 0.0415550574071756],
  [0.0556300796969936, -0.2039769588889765, 1.0569715142428786],
];

/** Tolerance for gamut checks on linear RGB channels, to absorb floating-point error. */
export const GAMUT_EPSILON = 0.000001;

/** Default precision for rounded results, such as CSS output (`formatCSS`) and `deltaE`. */
export const PRECISION = 5;

/** Multiply radians by this to get degrees. */
export const RAD2DEG = 180 / Math.PI;

/** Error messages for invariant checks. */
export const MESSAGES = {
  alpha: 'alpha must be a number between 0 and 1',
  alphaAdjustment: 'alpha must be a number between -1 and 1',
  amount: 'amount must be a number between 0 and 100',
  colorRequired: 'color is required',
  degreesRange: 'degrees must be a number between -360 and 360',
  hueArgs: 'point, chroma and h are required',
  hueRange: 'hue must be a number between 0 and 360',
  input: 'input is required',
  inputHex: 'input is required and must be a hex',
  inputNumber: 'input is required and must be a number',
  inputString: 'input is required and must be a string',
  invalid: 'invalid input',
  invalidColor: 'invalid color',
  invalidCSS: 'invalid CSS string',
  invalidHex: 'invalid hex',
  invalidKey: 'invalid key',
  invalidModel: 'invalid model',
  invalidRange: 'color value out of range',
  left: 'left is required and must be a string',
  lightnessRange: 'lightness must be a number between 0 and 1',
  options: 'invalid options',
  precision: 'precision must be an integer of 0 or more',
  precisionCSS: 'precision must be an integer of 1 or more',
  paletteSize: 'palette size must be at least 2',
  ratioRange: 'ratio must be a number between 0 and 1',
  right: 'right is required and must be a string',
  threshold: 'threshold must be a number between 0 and 255',
  thresholdNormalized: 'threshold must be a number between 0 and 1',
} as const;

/** Lightness of the lightest step in a monochromatic `palette`. */
export const MONOCHROMATIC_LIGHTNESS_MAX = 80;
