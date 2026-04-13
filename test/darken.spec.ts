import darken from '~/darken';
import { MESSAGES } from '~/modules/constants';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('darken', () => {
  it.each([
    { input: brightPink.hex, amount: 10, expected: '#cc0036' },
    { input: green.hslString, amount: 20, expected: 'hsl(136 100% 30%)' },
    { input: orange.oklabString, amount: 10, expected: 'oklab(59.904% 0.11396 0.12118)' },
    { input: violet.oklchString, amount: 20, expected: 'oklch(32.85% 0.20354 276.81)' },
    { input: yellow.rgbString, amount: 30, expected: 'rgb(211 175 0)' },
    { input: 'aqua', amount: 5, expected: '#00e5e6' },
  ])('$input with $amount should return $expected', ({ input, amount, expected }) => {
    expect(darken(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => darken([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => darken('#ff0044', {})).toThrow(MESSAGES.amount);
  });
});
