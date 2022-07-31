import hex2rgb from './hex2rgb';
import { invariant, isString, messages, round } from './modules/utils';
import parseCSS from './parse-css';

/**
 * Get the brightness difference between 2 colors.
 */
export default function brightnessDifference(left: string, right: string): number {
  invariant(isString(left), messages.left);
  invariant(isString(right), messages.right);

  const RGBLeft = hex2rgb(parseCSS(left));
  const RGBRight = hex2rgb(parseCSS(right));

  const rightY = (RGBRight.r * 299 + RGBRight.g * 587 + RGBRight.b * 114) / 1000;
  const leftY = (RGBLeft.r * 299 + RGBLeft.g * 587 + RGBLeft.b * 114) / 1000;

  return round(Math.abs(rightY - leftY), 4);
}
