import desaturate from '~/desaturate';
import { MESSAGES } from '~/modules/constants';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('desaturate', () => {
  it.each([
    [brightPink.hex, 10, '#f20d4a'],
    [green.hslString, 10, 'hsl(136 90% 50%)'],
    [orange.oklabString, 10, 'oklab(69.021% 0.12176 0.13721)'],
    [violet.oklchString, 10, 'oklch(46.904% 0.28276 277.75613)'],
    [yellow.rgbString, 10, 'rgb(248 225 116)'],
    ['pink', 10, '#fcc3cd'],
    ['#d1c7c7', 10, '#cccccc'],
  ])('%s with %s should return %s', (input, amount, expected) => {
    expect(desaturate(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => desaturate([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => desaturate('pink', '')).toThrow(MESSAGES.amount);
  });
});
