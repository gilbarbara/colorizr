/* eslint-disable prefer-const */
import { DEG2RAD } from '~/modules/constants';
import { addAlpha, extractAlpha, parseInput, restrictValues } from '~/modules/utils';

import { ConverterParameters, LAB, LCH } from '~/types';

const { sin, cos } = Math;

/**
 * Convert OkLCH to OkLab.
 *
 * @param input - The OkLCH color object or tuple.
 * @param precision - The number of decimal places for the result.
 * @returns The OkLab color object.
 */
export default function oklch2oklab(input: ConverterParameters<LCH>, precision?: number): LAB {
  /*
  Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
  These formulas were invented by David Dalrymple to obtain maximum contrast without going
  out of gamut if the parameters are in the range 0-1.

  A saturation multiplier was added by Gregor Aisch
  */
  let { l, c, h } = parseInput(input, 'oklch');
  const alpha = extractAlpha(input);

  /* v8 ignore next 3  -- @preserve */
  if (Number.isNaN(h) || h < 0) {
    h = 0;
  }

  return addAlpha(
    restrictValues({ l, a: c * cos(h * DEG2RAD), b: c * sin(h * DEG2RAD) }, precision),
    alpha,
  );
}
