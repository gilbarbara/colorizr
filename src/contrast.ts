import getLuminance from './luminance';
import { invariant, isString, messages, round } from './modules/utils';
import parseCSS from './parse-css';

/**
 * Get the color contrast between 2 colors.
 */
export default function contrast(left: string, right: string): number {
  invariant(isString(left), messages.left);
  invariant(isString(right), messages.right);

  const LuminanceLeft = getLuminance(parseCSS(left));
  const LuminanceRight = getLuminance(parseCSS(right));

  return round(
    LuminanceLeft >= LuminanceRight
      ? (LuminanceLeft + 0.05) / (LuminanceRight + 0.05)
      : (LuminanceRight + 0.05) / (LuminanceLeft + 0.05),
  );
}
