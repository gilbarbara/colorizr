import desaturate from '~/desaturate';
import { MESSAGES } from '~/modules/constants';
import saturate from '~/saturate';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('saturate', () => {
  it.each([
    { input: desaturate(brightPink.hex, 20), amount: 10, expected: '#f30c4a' },
    { input: desaturate(green.hslString, 20), amount: 10, expected: 'hsl(136 90% 50%)' },
    {
      input: desaturate(orange.oklabString, 20),
      amount: 10,
      expected: 'oklab(69.021% 0.12418 0.1374)',
    },
    {
      input: desaturate(violet.oklchString, 20),
      amount: 10,
      expected: 'oklch(46.987% 0.28399 277.67)',
    },
    { input: desaturate(yellow.rgbString, 20), amount: 10, expected: 'rgb(247 225 117)' },
    { input: '#ccc', amount: 10, expected: '#d1c7c7' },
    { input: 'pink', amount: 10, expected: '#ffc0cb' },
  ])('$input with $amount should return $expected', ({ input, amount, expected }) => {
    expect(saturate(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => saturate([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => saturate('blue', '')).toThrow(MESSAGES.amount);
  });
});
