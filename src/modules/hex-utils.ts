import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isHex, isNumber, isNumberInRange } from '~/modules/validators';

import { HEX } from '~/types';

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

  let alpha = input;

  if (input > 1) {
    alpha /= 100;
  }

  return Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
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
 * Convert a hexadecimal string to a number.
 *
 * @param input - The hexadecimal string.
 * @returns The numeric value.
 */
export function hexadecimalToNumber(input: string): number {
  return round(parseInt(input, 16));
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
