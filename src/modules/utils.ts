import { HSL, PlainObject, RGB, RGBArray } from '../types';

export const HSLKeys = ['h', 's', 'l'];
export const RGBKeys = ['r', 'g', 'b'];

/**
 * Constrain value into the range
 */
export function constrain(input: number, amount: number, range: number[], sign: string): number {
  invariant(arguments.length === 4, 'All parameters are required');

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
  invariant(isNumber(input), 'input is required');

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
 * Parse math string expressions
 */
export function expr(input: string): number {
  const chars = [...input];
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

  for (const [o, element] of op.entries()) {
    const value = parseFloat(n[o + 1]);

    switch (element) {
      case '+':
        parsed += value;
        break;
      case '-':
        parsed -= value;
        break;
      case '*':
        parsed *= value;
        break;
      case '/':
        parsed /= value;
        break;
      default:
        break;
    }
  }

  return parsed;
}

export function invariant(condition: boolean, message: string): asserts condition {
  if (condition) {
    return;
  }

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    if (message === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  let error;

  if (!message) {
    throw new Error(
      'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.',
    );
  } else {
    error = new Error(message);
  }

  error.name = 'colorizr';

  throw error;
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
      ([key, value]) => HSLKeys.includes(key) && value >= 0 && value <= (key === 'h' ? 360 : 100),
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
    entries.every(([key, value]) => RGBKeys.includes(key) && value >= 0 && value <= 255)
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
  invariant(isNumber(input), 'Input is not a number');

  /* istanbul ignore else */
  if (RGBKeys.includes(type)) {
    return Math.max(Math.min(input, 255), 0);
  }

  if (['s', 'l'].includes(type)) {
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
    throw new TypeError('options must be an array');
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
