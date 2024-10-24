import { MESSAGES } from '~/modules/constants';

import invert from '~/invert';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('invert', () => {
  it.each([
    [{ input: brightPink.hex, expected: '#00ffbb' }],
    [{ input: green.hslString, expected: 'hsl(316 100% 50%)' }],
    [{ input: orange.oklabString, expected: 'oklab(65.147% -0.06101 -0.18202)' }],
    [{ input: violet.oklchString, expected: 'oklch(92.006% 0.23635 126.69487)' }],
    [{ input: yellow.rgbString, expected: 'rgb(109 134 255)' }],
    [{ input: 'pink', expected: '#c0fff4' }],
  ])('should invert $input properly', ({ input, expected }) => {
    expect(invert(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => invert([])).toThrow(MESSAGES.inputString);
    expect(() => invert('')).toThrow(MESSAGES.inputString);
  });
});
