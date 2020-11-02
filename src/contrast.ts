import getLuminance from './luminance';
import parseCSS from './parse-css';
import { invariant, isString, messages, round } from './utils';

/**
 * Get the color contrast between 2 colors.
 */
export default function contrast(left: string, right: string): number {
  invariant(!isString(left), messages.left);
  invariant(!isString(right), messages.right);

  const LuminanceLeft = getLuminance(parseCSS(left));
  const LuminanceRight = getLuminance(parseCSS(right));

  let output;

  if (LuminanceLeft >= LuminanceRight) {
    output = (LuminanceLeft + 0.05) / (LuminanceRight + 0.05);
  } else {
    output = (LuminanceRight + 0.05) / (LuminanceLeft + 0.05);
  }

  return round(output);
}
