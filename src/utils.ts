import { HSL, RGB, PlainObject, RGBArray } from './types';

export const HSLKeys = ['h', 's', 'l'];
export const RGBKeys = ['r', 'g', 'b'];

/**
 * Constrain value into the range
 */
export function constrain(input: number, amount: number, range: number[], sign: string): number {
  invariant(arguments.length < 4, 'All parameters are required');

  const [min, max] = range;
  let value = expr(input + sign + amount);

  if (value < min) {
    value = min;
  } else if (value > max) {
    value = max;
  }

  return Math.abs(value);
}

/**
 * Constrain an angle
 */
export function constrainDegrees(input: number, amount: number): number {
  invariant(!isNumber(input), 'input is required');

  let value = input + amount;

  if (value > 360) {
    value %= 360;
  }

  if (value < 0) {
    value += 360;
  }

  return Math.abs(value);
}

/**
 * CSS named colors
 */
export const cssColors = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgrey: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  grey: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#FAFAD2',
  lightgray: '#d3d3d3',
  lightgrey: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370d8',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#d87093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};

/**
 * Parse math string expressions
 */
export function expr(input: string): number {
  const chars = input.split('');
  const n: string[] = [];
  const op: string[] = [];

  let parsed;
  let index = 0;
  let last = true;

  n[index] = '';

  // Parse the string
  for (const char of chars) {
    if (Number.isNaN(parseInt(char, 10)) && char !== '.' && !last) {
      op[index] = char;
      index++;
      n[index] = '';
      last = true;
    } else {
      n[index] += char;
      last = false;
    }
  }

  // Calculate the expression
  parsed = parseFloat(n[0]);
  for (let o = 0; o < op.length; o++) {
    const num = parseFloat(n[o + 1]);

    switch (op[o]) {
      case '+':
        parsed += num;
        break;
      case '-':
        parsed -= num;
        break;
      case '*':
        parsed *= num;
        break;
      case '/':
        parsed /= num;
        break;
      default:
        break;
    }
  }

  return parsed;
}

export function invariant(
  condition: boolean,
  message: string,
  a?: any,
  b?: any,
  c?: any,
  d?: any,
  e?: any,
  f?: any,
): void {
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    if (message === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (condition) {
    let error;

    if (!message) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.',
      );
    } else {
      const args = [a, b, c, d, e, f];
      let argIndex = 0;
      error = new Error(message.replace(/%s/g, () => args[argIndex++]));
      error.name = 'colorizr';
    }

    throw error;
  }
}

/**
 * Check if an object contains HSL values
 */
export function isHSL(input: any): input is HSL {
  if (!isPlainObject(input)) {
    return false;
  }

  const entries = Object.entries(input);

  return (
    !!entries.length &&
    entries.every(
      ([key, value]) =>
        HSLKeys.indexOf(key) >= 0 && value >= 0 && value <= (key === 'h' ? 360 : 100),
    )
  );
}

/**
 * Check if the input is a number and not NaN
 */
export function isNumber(input: any): input is number {
  return typeof input === 'number' && !Number.isNaN(input);
}

/**
 * Check if the input is an object
 */
export function isPlainObject(input: any): input is PlainObject {
  if (!input) {
    return false;
  }

  const { toString } = Object.prototype;
  const prototype = Object.getPrototypeOf(input);

  return (
    toString.call(input) === '[object Object]' &&
    (prototype === null || prototype === Object.getPrototypeOf({}))
  );
}

/**
 * Check if an object contains RGB values.
 */
export function isRGB(input: any): input is RGB {
  if (!isPlainObject(input)) {
    return false;
  }

  const entries = Object.entries(input);

  return (
    !!entries.length &&
    entries.every(([key, value]) => RGBKeys.indexOf(key) >= 0 && value >= 0 && value <= 255)
  );
}

/**
 * Check if an array contains RGB values.
 */
export function isRGBArray(input: any): input is RGBArray {
  return Array.isArray(input) && input.length === 3 && input.every(d => d >= 0 && d <= 255);
}

/**
 * Check if the input is a string
 */
export function isString(input: any): input is string {
  return typeof input === 'string';
}

/**
 * Limit values per type.
 */
export function limit(input: number, type: string): number {
  invariant(!isNumber(input), 'Input is not a number');

  /* istanbul ignore else */
  if (RGBKeys.indexOf(type) >= 0) {
    return Math.max(Math.min(input, 255), 0);
  }

  if (['s', 'l'].indexOf(type) >= 0) {
    return Math.max(Math.min(input, 100), 0);
  }

  if (type === 'h') {
    return Math.max(Math.min(input, 360), 0);
  }

  throw new Error('Invalid type');
}

export const messages = {
  amount: 'amount must be a number',
  left: 'left is required and must be a string',
  right: 'right is required and must be a string',
  input: 'input is required',
  inputString: 'input is required and must be a string',
  invalid: 'invalid input',
  options: 'invalid options',
};

/**
 * Creates an object composed of the picked source properties.
 */
export function pick(input: PlainObject, options: string[]): PlainObject {
  if (!Array.isArray(options)) {
    throw new Error('options must be an array');
  }

  return options
    .filter(d => typeof input[d] !== 'undefined')
    .reduce((acc: PlainObject, d) => {
      acc[d] = input[d];
      return acc;
    }, {});
}

/**
 * Round decimal numbers.
 */
export function round(input: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(input * factor) / factor;
}
