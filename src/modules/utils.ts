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
  ColorModel,
  ColorModelKey,
  ColorModelKeys,
  ConverterParameters,
  LAB,
  LCH,
  PlainObject,
} from '~/types';

/**
 * Add an alpha value to a color model.
 *
 * @param input - The color model object.
 * @param alpha - A number between 0 and 1 (values > 1 are divided by 100).
 * @returns The color model with alpha applied.
 */
export function addAlpha<T extends ColorModel>(input: T, alpha?: number): T {
  invariant(isValidColorModel(input), MESSAGES.invalid);

  let value = alpha;

  if (value === undefined) {
    return input;
  }

  /* v8 ignore next 3  -- @preserve */
  if (value > 1) {
    value /= 100;
  }

  if (value === 1) {
    return input;
  }

  return { ...input, alpha: value };
}

/**
 * Clamp a value between a min and max.
 *
 * @param value - The value to clamp.
 * @param min - The minimum value (default: 0).
 * @param max - The maximum value (default: 100).
 * @returns The clamped value.
 */
export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Constrain the degrees between 0 and 360.
 *
 * @param input - The base degrees value.
 * @param amount - The amount to add to the degrees.
 * @returns The constrained degrees value (0-360).
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
 * Extract alpha from converter input.
 *
 * @param input - The converter parameters (object or tuple).
 * @returns The alpha value or undefined for tuple inputs.
 */
export function extractAlpha<T extends ColorModel>(
  input: ConverterParameters<T>,
): number | undefined {
  if (Array.isArray(input)) {
    return undefined;
  }

  return input.alpha;
}

/**
 * Limit values per type.
 *
 * @param input - The value to limit.
 * @param model - The color model ('hsl' or 'rgb').
 * @param key - The property key to limit.
 * @returns The limited value.
 */
export function limit<TModel extends Extract<ColorModelKey, 'hsl' | 'rgb'>>(
  input: number,
  model: TModel,
  key: ColorModelKeys<TModel>,
): number {
  invariant(isNumber(input), MESSAGES.inputNumber);
  invariant(COLOR_MODELS.includes(model), `${MESSAGES.invalidModel}${model ? `: ${model}` : ''}`);
  invariant(COLOR_KEYS[model].includes(key), `${MESSAGES.invalidKey}${key ? `: ${key}` : ''}`);

  switch (model) {
    case 'hsl': {
      invariant(COLOR_KEYS.hsl.includes(key), MESSAGES.invalidKey);

      if (['l', 's'].includes(key)) {
        return clamp(input);
      }

      return clamp(input, 0, 360);
    }
    case 'rgb': {
      invariant(COLOR_KEYS.rgb.includes(key), MESSAGES.invalidKey);

      return clamp(input, 0, 255);
    }
    /* v8 ignore next 3  -- @preserve */
    default: {
      throw new Error('Invalid inputs');
    }
  }
}

/**
 * Parse the input parameters for converters.
 *
 * @param input - The converter parameters (object or tuple).
 * @param model - The target color model.
 * @returns The parsed color model object.
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

  invariant(validator[model](value), `${MESSAGES.invalidColor}: ${model}`);

  return value;
}

/**
 * Creates an object composed of the picked source properties.
 *
 * @param input - The source object.
 * @param options - The property keys to pick.
 * @returns The new object with picked properties.
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
 *
 * @param input - The LAB or LCH color model.
 * @param precision - The number of decimal places (default: 5).
 * @param forcePrecision - Whether to force the precision (default: true).
 * @returns The color model with restricted values.
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
 *
 * @param input - The number to round.
 * @param precision - The number of decimal places (default: 2).
 * @param forcePrecision - Whether to force exact precision (default: true).
 * @returns The rounded number.
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

/**
 * Log a warning in development mode.
 *
 * @param message - The warning message to log.
 */
export function warn(message: string): void {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`[colorizr] ${message}`);
  }
}

/**
 * Pre-computed step keys for each step count (3-20).
 *
 * Based on Tailwind CSS color scale conventions:
 * - Standard keys: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 * - 500 is typically the "base" color
 * - Lower numbers = lighter, higher numbers = darker (in light mode)
 *
 * Keys are symmetrically distributed to maintain visual balance.
 */
const STEP_KEYS: Record<number, number[]> = {
  3: [100, 500, 900],
  4: [100, 400, 600, 900],
  5: [100, 300, 500, 700, 900],
  6: [100, 200, 400, 600, 800, 900],
  7: [100, 200, 400, 500, 600, 800, 900],
  8: [100, 200, 300, 500, 600, 700, 800, 900],
  9: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  10: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  11: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  12: [50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  13: [50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950],
  14: [50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 950],
  15: [50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 750, 800, 850, 900, 950],
  16: [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 750, 800, 850, 900, 950],
  17: [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 650, 700, 750, 800, 850, 900, 950],
  18: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 650, 700, 750, 800, 850, 900, 950],
  19: [
    50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
  ],
  20: [
    50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
    1000,
  ],
};

/**
 * Get the step keys for a given step count.
 *
 * @param steps - The number of steps (clamped to 3-20).
 * @returns The array of step keys.
 */
export function getScaleStepKeys(steps: number): number[] {
  const value = clamp(Math.round(steps), 3, 20);

  return STEP_KEYS[value];
}
