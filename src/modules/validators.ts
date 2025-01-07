import { COLOR_KEYS } from '~/modules/constants';
import { CSSColor, cssColors } from '~/modules/css-colors';

import { ColorModel, HEX, HSL, LAB, LCH, PlainObject, RGB } from '~/types';

export function hasValidMatches(input: unknown): input is string[] {
  return Array.isArray(input) && input.length === 6;
}

/**
 * Check if the input is a CSS named color
 */
export function isNamedColor(input: unknown): input is CSSColor {
  return isString(input) && Object.keys(cssColors).includes(input.toLowerCase());
}

/**
 * Check if the input is a number and not NaN
 */
export function isNumber(input: unknown): input is number {
  return typeof input === 'number' && !Number.isNaN(input);
}

/**
 * Check if the input is an object
 */
export function isPlainObject(input: unknown): input is PlainObject {
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
 * Check if the input is a string
 */
export function isString(input: unknown, validate = true): input is string {
  const isValid = typeof input === 'string';

  if (validate) {
    return isValid && !!input.trim().length;
  }

  return isValid;
}

export function isValidColorModel<T extends ColorModel>(input: T): input is T {
  return isHSL(input) || isRGB(input) || isLAB(input) || isLCH(input);
}

export function isHex(input: any): input is HEX {
  if (!isString(input)) {
    return false;
  }

  return /^#([\da-f]{3,4}|[\da-f]{6,8})$/i.test(input);
}

/**
 * Check if an object contains HSL values
 * The input must be an object with keys 'h', 's', and 'l'
 * with values between 0 and 360 for hue or 0 and 100 for the others.
 */
export function isHSL(input: unknown): input is HSL {
  if (!isPlainObject(input)) {
    return false;
  }

  const entries = Object.entries(input);

  return (
    !!entries.length &&
    entries.every(([key, value]) => {
      if (key === 'h') {
        return value >= 0 && value <= 360;
      }

      if (key === 'alpha') {
        return value >= 0 && value <= 1;
      }

      return COLOR_KEYS.hsl.includes(key) && value >= 0 && value <= 100;
    })
  );
}

/**
 * Check if an object contains LAB values
 * The input must be an object with keys 'l', 'a', and 'b' with values between -1 and 1.
 */
export function isLAB(input: unknown): input is LAB {
  if (!isPlainObject(input)) {
    return false;
  }

  const entries = Object.entries(input);

  return (
    !!entries.length &&
    entries.every(([key, value]) => {
      if (key === 'l') {
        return value >= 0 && value <= 100;
      }

      if (key === 'alpha') {
        return value >= 0 && value <= 1;
      }

      return COLOR_KEYS.oklab.includes(key) && value >= -1 && value <= 1;
    })
  );
}

/**
 * Check if an object contains LAB values
 * The input must be an object with keys 'l', 'c', and 'h' with values between 0 and 360.
 */
export function isLCH(input: unknown): input is LCH {
  if (!isPlainObject(input)) {
    return false;
  }

  const entries = Object.entries(input);

  return (
    !!entries.length &&
    entries.every(([key, value]) => {
      if (key === 'l') {
        return value >= 0 && value <= 100;
      }

      if (key === 'alpha') {
        return value >= 0 && value <= 1;
      }

      return COLOR_KEYS.oklch.includes(key) && value >= 0 && value <= (key === 'h' ? 360 : 1);
    })
  );
}

/**
 * Check if an object contains RGB values.
 * The input must be an object with keys 'r', 'g', and 'b' with values between 0 and 255.
 */
export function isRGB(input: unknown): input is RGB {
  if (!isPlainObject(input)) {
    return false;
  }

  const entries = Object.entries(input);

  return (
    !!entries.length &&
    entries.every(([key, value]) => {
      if (key === 'alpha') {
        return value >= 0 && value <= 1;
      }

      return COLOR_KEYS.rgb.includes(key) && value >= 0 && value <= 255;
    })
  );
}
