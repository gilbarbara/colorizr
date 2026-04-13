import brightnessDifference from '~/brightness-difference';
import { MESSAGES } from '~/modules/constants';

import { brightPink, green } from './__fixtures__';

describe('brightnessDifference', () => {
  it.each([
    { left: brightPink.hex, right: 'rgb(255, 255, 255)', expected: 171.003 },
    { left: brightPink.hslString, right: '#fff', expected: 171.003 },
    { left: brightPink.rgbString, right: 'hsl(0, 0, 0)', expected: 83.997 },
    { left: green.oklabString, right: 'hsl(0, 0, 0)', expected: 157.437 },
    { left: green.hslString, right: 'black', expected: 157.437 },
    { left: 'blanchedalmond', right: 'aliceblue', expected: 8.846 },
  ])('$left with $right should return $expected', ({ left, right, expected }) => {
    expect(brightnessDifference(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => brightnessDifference('')).toThrow(MESSAGES.left);
    expect(() => brightnessDifference('black', '')).toThrow(MESSAGES.right);
  });
});
