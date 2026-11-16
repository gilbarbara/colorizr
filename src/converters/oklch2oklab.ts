/* eslint-disable prefer-const */
import { addAlpha, extractAlpha } from '~/modules/alpha';
import { DEG2RAD, MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { parseInput, restrictValues } from '~/modules/utils';
import { isPrecision } from '~/modules/validators';

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
  invariant(precision === undefined || isPrecision(precision, 0), MESSAGES.precision);
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
