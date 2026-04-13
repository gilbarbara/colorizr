import desaturate from '~/desaturate';
import { MESSAGES } from '~/modules/constants';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('desaturate', () => {
  it.each([
    { input: brightPink.hex, amount: 10, expected: '#f20d4a' },
    { input: green.hslString, amount: 10, expected: 'hsl(136 90% 50%)' },
    { input: orange.oklabString, amount: 10, expected: 'oklab(69.021% 0.12176 0.13721)' },
    { input: violet.oklchString, amount: 10, expected: 'oklch(46.904% 0.28276 277.76)' },
    { input: yellow.rgbString, amount: 10, expected: 'rgb(248 225 116)' },
    { input: 'pink', amount: 10, expected: '#fcc3cd' },
    { input: '#d1c7c7', amount: 10, expected: '#cccccc' },
  ])('$input with $amount should return $expected', ({ input, amount, expected }) => {
    expect(desaturate(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => desaturate([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => desaturate('pink', '')).toThrow(MESSAGES.amount);
  });
});
