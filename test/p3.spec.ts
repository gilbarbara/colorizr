import { MESSAGES } from '~/modules/constants';
import { getOkLCHMaxChroma, getP3MaxColor } from '~/p3';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('getMaxOkLCHChroma', () => {
  it.each([
    [{ input: brightPink.hex, expected: 0.28643 }],
    [{ input: brightPink.oklch, expected: 0.28643 }],
    [{ input: green.hslString, expected: 0.30921 }],
    [{ input: green.oklch, expected: 0.30921 }],
    [{ input: orange.oklabString, expected: 0.22488 }],
    [{ input: orange.oklch, expected: 0.22488 }],
    [{ input: violet.oklchString, expected: 0.30223 }],
    [{ input: violet.oklch, expected: 0.30224 }],
    [{ input: yellow.rgbString, expected: 0.16983 }],
    [{ input: yellow.oklch, expected: 0.16983 }],
    [{ input: { l: 0.8853, c: 0.1, h: 188 }, expected: 0.20772 }],
    [{ input: { l: 0.6941, c: 0.1, h: 344 }, expected: 0.33028 }],
    [{ input: { l: 0.8471, c: 0.1, h: 143 }, expected: 0.34369 }],
    [{ input: { l: 0.86, c: 0.1, h: 143.15 }, expected: 0.34782 }],
    [{ input: { l: 0.7, c: 0.1, h: 139 }, expected: 0.2594 }],
  ])('should return $expected for $input', ({ input, expected }) => {
    expect(getOkLCHMaxChroma(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    expect(() => getP3MaxColor({ l: -0.1, c: 0.1, h: 0 })).toThrow(MESSAGES.lightnessRange);
    expect(() => getP3MaxColor({ l: 1.1, c: 0.1, h: 0 })).toThrow(MESSAGES.lightnessRange);
    expect(() => getP3MaxColor({ l: 0.5, c: 0.1, h: -20 })).toThrow(MESSAGES.hueRange);
    expect(() => getP3MaxColor({ l: 0.5, c: 0.1, h: 420 })).toThrow(MESSAGES.hueRange);

    // @ts-expect-error - invalid parameters
    expect(() => getP3MaxColor({ l: '0.5', c: 0.2, h: 20 }, 0)).toThrow(MESSAGES.lightnessRange);
    // @ts-expect-error - invalid parameters
    expect(() => getP3MaxColor({ l: 0.5, c: 0.1, h: '120' })).toThrow(MESSAGES.hueRange);
  });
});

describe('getP3MaxColor', () => {
  it.each([
    [{ input: brightPink.oklch, expected: 'oklch(0.63269 0.28643 19.90224)' }],
    [{ input: brightPink.hex, expected: 'oklch(0.6326860506565246 0.28643 19.902240785746187)' }],
    [{ input: green.hslString, expected: 'oklch(0.8687605896103548 0.30921 144.65540033481756)' }],
    [{ input: orange.oklabString, expected: 'oklch(0.70622 0.22488 46.11007798489595)' }],
    [{ input: violet.oklchString, expected: 'oklch(0.47642 0.30223 274.94)' }],
    [{ input: yellow.rgbString, expected: 'oklch(0.922350998807585 0.16983 97.77771337249595)' }],
  ])('should return $expected for $input', ({ input, expected }) => {
    expect(getP3MaxColor(input)).toBe(expected);
  });
});
