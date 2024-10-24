import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isHex, isNumber } from '~/modules/validators';

import { Alpha } from '~/types';

/**
 * Add an alpha value to a hex string
 */
export function addAlphaToHex(input: string, alpha: Alpha): string {
  invariant(isHex(input), MESSAGES.inputHex);
  invariant(isNumber(alpha), MESSAGES.inputNumber);

  if (alpha >= 1) {
    return removeAlphaFromHex(input);
  }

  return `${removeAlphaFromHex(input)}${convertAlphaToHex(alpha)}`;
}

/**
 * Convert an alpha value to a hex value.
 */
export function convertAlphaToHex(input: Alpha): string {
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
 * Extract the alpha value from a hex string
 */
export function extractAlphaFromHex(input: string): number {
  invariant(isHex(input), MESSAGES.inputString);

  const alpha = input.substring(7, 9);

  if (!alpha) {
    return 1;
  }

  return round(parseInt(alpha, 16) / 255);
}

export function hexadecimalToNumber(input: string) {
  return round(parseInt(input, 16));
}

/**
 * Remove the alpha value from a hex string
 */
export function removeAlphaFromHex(input: string) {
  invariant(isHex(input), MESSAGES.inputHex);

  if (input.length === 5) {
    return input.substring(0, 4);
  }

  return input.substring(0, 7);
}
