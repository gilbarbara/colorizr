import formatHex from '~/format-hex';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isHex, isNumberInRange, isValidColorModel } from '~/modules/validators';

import { ColorModel, ConverterParameters, HEX } from '~/types';

/**
 * Add an alpha value to a color model.
 *
 * @param input - The color model object.
 * @param alpha - A number between 0 and 1.
 * @returns The color model with alpha applied.
 */
export function addAlpha<T extends ColorModel>(input: T, alpha?: number): T {
  invariant(isValidColorModel(input), MESSAGES.invalid);

  if (alpha === undefined || alpha === 1) {
    return input;
  }

  return { ...input, alpha };
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

  // #rgb must become #rrggbb, or a 2-digit alpha yields an invalid 5-digit hex
  return `${formatHex(removeAlphaFromHex(input))}${convertAlphaToHex(alpha)}` as HEX;
}

/**
 * Convert an alpha value to a hex value.
 *
 * @param input - A number between 0 and 1.
 * @returns The two-character hex string.
 */
export function convertAlphaToHex(input: number): string {
  invariant(isNumberInRange(input, 0, 1), MESSAGES.alpha);

  return Math.round(input * 255)
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

  // Expand #rgba to #rrggbbaa so the alpha is always at the same position
  const alpha = formatHex(input).substring(7, 9);

  if (!alpha) {
    return 1;
  }

  const value = parseInt(alpha, 16);
  const short = round(value / 255);

  // 2 decimals can't represent all 256 hex values (0x88 → 0.53 → 0x87); 3 decimals always can
  return Math.round(short * 255) === value ? short : round(value / 255, 3);
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
