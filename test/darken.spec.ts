import { MESSAGES } from '~/modules/constants';

import darken from '~/darken';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('darken', () => {
  it.each([
    [brightPink.hex, 10, '#cc0036'],
    [green.hslString, 20, 'hsl(136 100% 30%)'],
    [orange.oklabString, 10, 'oklab(59.904% 0.11396 0.12118)'],
    [violet.oklchString, 20, 'oklch(32.85% 0.20355 276.80834)'],
    [yellow.rgbString, 30, 'rgb(211 175 0)'],
    ['aqua', 5, '#00e6e6'],
  ])('%s with %s should return %s', (input, amount, expected) => {
    expect(darken(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => darken([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => darken('#ff0044', {})).toThrow(MESSAGES.alpha);
  });
});
