import hex2rgb from './converters/hex2rgb';
import { invariant, isString, MESSAGES } from './modules/utils';
import parseCSS from './parse-css';

/**
 * Get the difference between 2 colors.
 */
export default function colorDifference(left: string, right: string): number {
  invariant(isString(left), MESSAGES.left);
  invariant(isString(right), MESSAGES.right);

  const RGBLeft = hex2rgb(parseCSS(left));
  const RGBRight = hex2rgb(parseCSS(right));

  return (
    Math.max(RGBLeft.r, RGBRight.r) -
    Math.min(RGBLeft.r, RGBRight.r) +
    (Math.max(RGBLeft.g, RGBRight.g) - Math.min(RGBLeft.g, RGBRight.g)) +
    (Math.max(RGBLeft.b, RGBRight.b) - Math.min(RGBLeft.b, RGBRight.b))
  );
}
