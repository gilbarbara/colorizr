// @flow

/**
 * Parse math string expressions.
 *
 * @function
 * @param {string} input
 *
 * @returns {number}
 */
export function expr(input: string): number {
  const chars = input.split('');
  const n = [];
  const op = [];

  let parsed;
  let index = 0;
  let last = true;

  n[index] = '';

  // Parse the string
  for (let c = 0; c < chars.length; c++) {
    if (isNaN(parseInt(chars[c], 10)) && chars[c] !== '.' && !last) {
      op[index] = chars[c];
      index++;
      n[index] = '';
      last = true;
    }
    else {
      n[index] += chars[c];
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

/**
 * Check if an object has a property.
 *
 * @param {*} input
 * @param {string} prop
 * @returns {boolean}
 */
export function hasProperty(input: any, prop: string): boolean {
  if (!input || !prop) return false;

  return Object.prototype.hasOwnProperty.call(input, prop);
}

/**
 * Check if the input is an object
 *
 * @param {*} input
 * @returns {boolean}
 */
export function isPlainObject(input: any): boolean {
  if (!input) return false;

  const { toString } = Object.prototype;
  const prototype = Object.getPrototypeOf(input);

  return toString.call(input) === '[object Object]' && (prototype === null || prototype === Object.getPrototypeOf({}));
}

export function isRequired(name) {
  throw new Error(`${name || 'parameter'} is required`);
}

/**
 * Creates an object composed of the picked source properties.
 *
 * @param {Object} input
 * @param {Array} options
 *
 * @returns {Object}
 */
export function pick(input: Object, options: Array<string>): Object {
  if (!Array.isArray(options)) {
    throw new Error('options must be an array');
  }

  return options
    .filter(d => typeof input[d] !== 'undefined')
    .reduce((acc, i) => {
      acc[i] = input[i];
      return acc;
    }, {});
}

/**
 * Round decimal numbers.
 *
 * @function
 * @param {number} input
 * @param {number} digits
 *
 * @returns {number}
 */
export function round(input: number, digits: number = 2): number {
  const factor = 10 ** digits;
  return Math.round(input * factor) / factor;
}

export function validateHex(input: string): boolean {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(input);
}
