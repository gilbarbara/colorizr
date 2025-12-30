import hex2rgb from '~/converters/hex2rgb';
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isString } from '~/modules/validators';
import parseCSS from '~/parse-css';

// APCA W3 Constants (version 0.0.98G-4g)
// Based on official SAPC-APCA implementation from Myndex/SAPC-APCA
export const APCA_VERSION = '0.0.98G-4g';

// Exponents
const mainTRC = 2.4; // sRGB gamma (simpler than WCAG piecewise)
const normBG = 0.56; // Normal polarity: dark text on light bg
const normTXT = 0.57;
const revBG = 0.65; // Reverse polarity: light text on dark bg
const revTXT = 0.62;

// sRGB coefficients
const sRco = 0.2126729;
const sGco = 0.7151522;
const sBco = 0.072175;

// Black soft clamp
const blkThreshold = 0.022; // Threshold for soft clamp
const blkClamp = 1.414; // Clamp exponent

// Scaling
const scaleBoW = 1.14; // Black on white scale
const scaleWoB = 1.14; // White on black scale
const loBoWOffset = 0.027; // Low contrast offset
const loWoBOffset = 0.027;
const loClip = 0.1; // Clip contrasts below |10|
const deltaYmin = 0.0005; // Minimum Y difference

/**
 * Apply soft clamp to black levels.
 * Improves contrast prediction for very dark colors.
 */
function softClamp(Y: number): number {
  return Y > blkThreshold ? Y : Y + (blkThreshold - Y) ** blkClamp;
}

/**
 * Convert sRGB values to luminance (Y) for APCA.
 * Uses simple gamma 2.4, unlike WCAG's piecewise function.
 */
function sRGBtoY(r: number, g: number, b: number): number {
  return sRco * (r / 255) ** mainTRC + sGco * (g / 255) ** mainTRC + sBco * (b / 255) ** mainTRC;
}

/**
 * Calculate APCA contrast between foreground and background colors.
 *
 * APCA (Accessible Perceptual Contrast Algorithm) is polarity-aware:
 * - Positive values indicate dark text on light background
 * - Negative values indicate light text on dark background
 *
 * @returns Lc (Lightness contrast) value, roughly -108 to +106
 */
export default function apcaContrast(background: string, foreground: string): number {
  invariant(isString(background), MESSAGES.inputString);
  invariant(isString(foreground), MESSAGES.inputString);

  const bg = hex2rgb(parseCSS(background, 'hex'));
  const fg = hex2rgb(parseCSS(foreground, 'hex'));

  const txtY = softClamp(sRGBtoY(fg.r, fg.g, fg.b));
  const bgY = softClamp(sRGBtoY(bg.r, bg.g, bg.b));

  // Return 0 for extremely low ΔY
  if (Math.abs(bgY - txtY) < deltaYmin) {
    return 0;
  }

  // Calculate SAPC based on polarity
  // Normal polarity: dark text on light background
  // Reverse polarity: light text on dark background
  const SAPC =
    bgY > txtY
      ? (bgY ** normBG - txtY ** normTXT) * scaleBoW
      : (bgY ** revBG - txtY ** revTXT) * scaleWoB;

  // Apply low contrast clipping and offset
  if (Math.abs(SAPC) < loClip) {
    return 0;
  }

  const Lc = SAPC > 0 ? (SAPC - loBoWOffset) * 100 : (SAPC + loWoBOffset) * 100;

  return round(Lc, 5);
}
