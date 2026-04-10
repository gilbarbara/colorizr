import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isHex, isNumber, isNumberInRange, isValidColorModel } from '~/modules/validators';

import { ColorModel, ConverterParameters, HEX } from '~/types';

/**
 * Add an alpha value to a color model.
 *
 * @param input - The color model object.
 * @param alpha - A number between 0 and 1 (values > 1 are divided by 100).
 * @returns The color model with alpha applied.
 */
export function addAlpha<T extends ColorModel>(input: T, alpha?: number): T {
  invariant(isValidColorModel(input), MESSAGES.invalid);

  const value = normalizeAlpha(alpha);

  if (value === undefined || value === 1) {
    return input;
  }

  return { ...input, alpha: value };
}

/**
 * Add an alpha value to a hex string.
 *
 * @param input - The hex color string.
 * @param alpha - A number between 0 and 1.
 * @returns The hex color string with alpha.
 */
export function addAlphaToHex(input: string, alpha: number): HEX {
  invariant(isHex(input), MESSAGES.inputHex);
  invariant(isNumberInRange(alpha, 0, 1), MESSAGES.alpha);

  if (alpha >= 1) {
    return removeAlphaFromHex(input);
  }

  return `${removeAlphaFromHex(input)}${convertAlphaToHex(alpha)}` as HEX;
}

/**
 * Convert an alpha value to a hex value.
 *
 * @param input - A number between 0 and 1 (values > 1 are divided by 100).
 * @returns The two-character hex string.
 */
export function convertAlphaToHex(input: number): string {
  invariant(isNumber(input), MESSAGES.inputNumber);

  const alpha = normalizeAlpha(input);

  return Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
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
 * Extract the alpha value from a hex string.
 *
 * @param input - The hex color string.
 * @returns The alpha value (0-1), defaults to 1 if no alpha present.
 */
export function extractAlphaFromHex(input: string): number {
  invariant(isHex(input), MESSAGES.inputString);

  const alpha = input.substring(7, 9);

  if (!alpha) {
    return 1;
  }

  return round(parseInt(alpha, 16) / 255);
}

/**
 * Normalize an alpha value to the 0-1 range.
 * Values > 1 are treated as percentages and divided by 100.
 */
export function normalizeAlpha(value: number): number;
export function normalizeAlpha(value: number | undefined): number | undefined;
export function normalizeAlpha(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  return Math.min(1, Math.max(0, value > 1 ? value / 100 : value));
}

/**
 * Remove the alpha value from a hex string.
 *
 * @param input - The hex color string.
 * @returns The hex color string without alpha.
 */
export function removeAlphaFromHex(input: string): HEX {
  invariant(isHex(input), MESSAGES.inputHex);

  if (input.length === 5) {
    return input.substring(0, 4) as HEX;
  }

  return input.substring(0, 7) as HEX;
}
