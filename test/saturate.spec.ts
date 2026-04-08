import desaturate from '~/desaturate';
import { MESSAGES } from '~/modules/constants';
import saturate from '~/saturate';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('saturate', () => {
  it.each([
    [desaturate(brightPink.hex, 20), 10, '#f30c4a'],
    [desaturate(green.hslString, 20), 10, 'hsl(136 90% 50%)'],
    [desaturate(orange.oklabString, 20), 10, 'oklab(69.021% 0.12418 0.1374)'],
    [desaturate(violet.oklchString, 20), 10, 'oklch(46.987% 0.28399 277.67)'],
    [desaturate(yellow.rgbString, 20), 10, 'rgb(247 225 117)'],
    ['#ccc', 10, '#d1c7c7'],
    ['pink', 10, '#ffc0cb'],
  ])('%s with %s should return %s', (input, amount, expected) => {
    expect(saturate(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => saturate([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => saturate('blue', '')).toThrow(MESSAGES.amount);
  });
});
