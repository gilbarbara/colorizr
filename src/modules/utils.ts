import { COLOR_KEYS, COLOR_MODELS, MESSAGES, PRECISION } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import {
  isHSL,
  isLAB,
  isLCH,
  isNumber,
  isPlainObject,
  isRGB,
  isValidColorModel,
} from '~/modules/validators';

import {
  Alpha,
  ColorModel,
  ColorModelKey,
  ColorModelKeys,
  ConverterParameters,
  LAB,
  LCH,
  PlainObject,
} from '~/types';

export function addAlpha<T extends ColorModel>(input: any, alpha?: Alpha): T {
  invariant(isValidColorModel(input), MESSAGES.invalid);

  let value = alpha;

  if (!value) {
    return input;
  }

  /* c8 ignore next 3 */
  if (value > 1) {
    value /= 100;
  }

  if (value === 1) {
    return input;
  }

  return { ...input, alpha: value };
}

/**
 * Clamp a value between a min and max
 * @param value
 * @param [min=0] - The minimum value
 * @param [max=100] - The maximum value
 */
export function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Constrain the degrees between 0 and 360
 */
export function constrainDegrees(input: number, amount: number): number {
  invariant(isNumber(input), MESSAGES.inputNumber);

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
 * Limit values per type.
 */
export function limit<TModel extends Extract<ColorModelKey, 'hsl' | 'rgb'>>(
  input: number,
  model: TModel,
  key: ColorModelKeys<TModel>,
): number {
  invariant(isNumber(input), 'Input is not a number');
  invariant(COLOR_MODELS.includes(model), `Invalid model${model ? `: ${model}` : ''}`);
  invariant(COLOR_KEYS[model].includes(key), `Invalid key${key ? `: ${key}` : ''}`);

  switch (model) {
    case 'hsl': {
      invariant(COLOR_KEYS.hsl.includes(key), 'Invalid key');

      if (['s', 'l'].includes(key)) {
        return clamp(input);
      }

      return clamp(input, 0, 360);
    }
    case 'rgb': {
      invariant(COLOR_KEYS.rgb.includes(key), 'Invalid key');

      return clamp(input, 0, 255);
    }
    /* c8 ignore next 3 */
    default: {
      throw new Error('Invalid inputs');
    }
  }
}

/**
 * Parse the input parameters
 */
export function parseInput<T extends ColorModel>(
  input: ConverterParameters<T>,
  model: ColorModelKey,
): T {
  const keys = COLOR_KEYS[model];
  const validator = {
    hsl: isHSL,
    oklab: isLAB,
    oklch: isLCH,
    rgb: isRGB,
  };

  invariant(isPlainObject(input) || Array.isArray(input), MESSAGES.invalid);

  const value = Array.isArray(input)
    ? ({ [keys[0]]: input[0], [keys[1]]: input[1], [keys[2]]: input[2] } as unknown as T)
    : input;

  invariant(validator[model](value), `invalid ${model} color`);

  return value;
}

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
 * Restrict the values to a certain number of digits.
 */
export function restrictValues<T extends LAB | LCH>(
  input: T,
  precision: number = PRECISION,
  forcePrecision = true,
): T {
  const output = new Map(Object.entries(input));

  for (const [key, value] of output.entries()) {
    output.set(key, round(value, precision, forcePrecision));
  }

  return Object.fromEntries(output) as T;
}

/**
 * Round decimal numbers.
 */
export function round(input: number, precision = 2, forcePrecision = true): number {
  if (!isNumber(input) || input === 0) {
    return 0;
  }

  if (forcePrecision) {
    const factor = 10 ** precision;

    return Math.round(input * factor) / factor;
  }

  const absInput = Math.abs(input);

  let digits = Math.abs(Math.ceil(Math.log(absInput) / Math.LN10));

  if (digits === 0) {
    digits = 2;
  } else if (digits > precision) {
    digits = precision;
  }

  let exponent = precision - (digits < 0 ? 0 : digits);

  if (exponent <= 1 && precision > 1) {
    exponent = 2;
  } else if (exponent > precision || exponent === 0) {
    exponent = precision;
  }

  const factor = 10 ** exponent;

  return Math.round(input * factor) / factor;
}
