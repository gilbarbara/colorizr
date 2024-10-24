import { limit, parseInput } from '~/modules/utils';

import { ConverterParameters, HSL, RGB } from '~/types';

/** Convert RGB to HSL */
export default function rgb2hsl(input: ConverterParameters<RGB>): HSL {
  const value = parseInput(input, 'rgb');

  const rLimit = limit(value.r, 'rgb', 'r') / 255;
  const gLimit = limit(value.g, 'rgb', 'g') / 255;
  const bLimit = limit(value.b, 'rgb', 'b') / 255;

  const min = Math.min(rLimit, gLimit, bLimit);
  const max = Math.max(rLimit, gLimit, bLimit);
  const delta = max - min;

  let h = 0;
  let s;
  const l = (max + min) / 2;
  let rate;

  switch (max) {
    case rLimit:
      rate = !delta ? 0 : (gLimit - bLimit) / delta;
      h = 60 * rate;
      break;
    case gLimit:
      rate = (bLimit - rLimit) / delta;
      h = 60 * rate + 120;
      break;
    case bLimit:
      rate = (rLimit - gLimit) / delta;
      h = 60 * rate + 240;
      break;
    /* c8 ignore next 2 */
    default:
      break;
  }

  if (h < 0) {
    h = 360 + h;
  }

  if (min === max) {
    s = 0;
  } else {
    s = l < 0.5 ? delta / (2 * l) : delta / (2 - 2 * l);
  }

  return {
    h: Math.abs(+(h % 360).toFixed(2)),
    s: +(s * 100).toFixed(2),
    l: +(l * 100).toFixed(2),
  };
}
