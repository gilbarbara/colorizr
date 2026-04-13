import lighten from '~/lighten';
import { MESSAGES } from '~/modules/constants';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('lighten', () => {
  it.each([
    { input: brightPink.hex, amount: 10, expected: '#ff3369' },
    { input: green.hslString, amount: 10, expected: 'hsl(136 100% 60%)' },
    { input: orange.oklabString, amount: 10, expected: 'oklab(75.08% 0.10208 0.13556)' },
    { input: violet.oklchString, amount: 10, expected: 'oklch(53.31% 0.27191 284.48)' },
    { input: yellow.rgbString, amount: 10, expected: 'rgb(255 239 160)' },
    { input: '#ccc', amount: 10, expected: '#e6e6e6' },
    { input: 'pink', amount: 10, expected: '#fff3f5' },
  ])('$input with $amount should return $expected', ({ input, amount, expected }) => {
    expect(lighten(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => lighten('')).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => lighten('pink', {})).toThrow(MESSAGES.amount);
  });
});
