import apcaContrast from '~/apca';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isString } from '~/modules/validators';

export interface ReadableColorAPCAOptions {
  /**
   * The dark color to return if it has better contrast.
   * @default '#000000'
   */
  darkColor?: string;
  /**
   * The light color to return if it has better contrast.
   * @default '#ffffff'
   */
  lightColor?: string;
}

/**
 * Get the most readable color for a given background using APCA contrast.
 *
 * APCA (Accessible Perceptual Contrast Algorithm) is the contrast method
 * proposed for WCAG 3.0. It's polarity-aware and provides more accurate
 * contrast predictions than WCAG 2.x contrast ratio.
 *
 * This function compares the APCA contrast of both light and dark options
 * against the background and returns the one with higher absolute contrast.
 *
 * @param backgroundColor - The background color string.
 * @param options - Options for the light and dark colors.
 * @returns The most readable color (light or dark).
 */
export default function readableColorAPCA(
  backgroundColor: string,
  options: ReadableColorAPCAOptions = {},
): string {
  const { darkColor = '#000000', lightColor = '#ffffff' } = options;

  invariant(isString(backgroundColor), MESSAGES.inputString);

  const darkContrast = Math.abs(apcaContrast(backgroundColor, darkColor));
  const lightContrast = Math.abs(apcaContrast(backgroundColor, lightColor));

  // Return darkColor if equal (arbitrary but consistent)
  return darkContrast >= lightContrast ? darkColor : lightColor;
}
