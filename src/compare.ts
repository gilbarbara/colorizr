import getBrightnessDifference from './brightness-difference';
import getColorDifference from './color-difference';
import getContrast from './contrast';
import { invariant, isString, messages } from './modules/utils';
import { Analysis } from './types';

/**
 * Check 2 colors for WCAG compliance.
 */
export default function compare(left: string, right: string): Analysis {
  invariant(isString(left), messages.left);
  invariant(isString(right), messages.right);

  const colorThreshold = 500;
  const brightnessThreshold = 125;

  const colorDifference = getColorDifference(left, right);
  const contrast = getContrast(left, right);
  const brightnessDifference = getBrightnessDifference(left, right);

  const isBright = brightnessDifference >= brightnessThreshold;
  const hasEnoughDifference = colorDifference >= colorThreshold;

  let compliant = 0;

  if (isBright && hasEnoughDifference) {
    compliant = 2;
  } else if (isBright || hasEnoughDifference) {
    compliant = 1;
  }

  return {
    brightnessDifference,
    colorDifference,
    compliant,
    contrast,
    largeAA: contrast >= 3,
    largeAAA: contrast >= 4.5,
    normalAA: contrast >= 4.5,
    normalAAA: contrast >= 7,
  };
}
