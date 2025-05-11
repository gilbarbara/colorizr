import brightnessDifference from '~/brightness-difference';
import { MESSAGES } from '~/modules/constants';

import { brightPink, green } from './__fixtures__';

describe('brightnessDifference', () => {
  it.each([
    [brightPink.hex, 'rgb(255, 255, 255)', 171.003],
    [brightPink.hslString, '#fff', 171.003],
    [brightPink.rgbString, 'hsl(0, 0, 0)', 83.997],
    [green.oklabString, 'hsl(0, 0, 0)', 157.437],
    [green.hslString, 'black', 157.437],
    ['blanchedalmond', 'aliceblue', 8.846],
  ])('%s with %s should return %s', (left, right, expected) => {
    expect(brightnessDifference(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => brightnessDifference('')).toThrow(MESSAGES.left);
    expect(() => brightnessDifference('black', '')).toThrow(MESSAGES.right);
  });
});
