import lighten from '~/lighten';
import { MESSAGES } from '~/modules/constants';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('lighten', () => {
  it.each([
    [brightPink.hex, 10, '#ff3369'],
    [green.hslString, 10, 'hsl(136 100% 60%)'],
    [orange.oklabString, 10, 'oklab(75.08% 0.10208 0.13556)'],
    [violet.oklchString, 10, 'oklch(53.31% 0.27191 284.47832)'],
    [yellow.rgbString, 10, 'rgb(255 239 160)'],
    ['#ccc', 10, '#e6e6e6'],
    ['pink', 10, '#fff3f5'],
  ])('%s with %s should return %s', (input, amount, expected) => {
    expect(lighten(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => lighten('')).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => lighten('pink', {})).toThrow(MESSAGES.amount);
  });
});
