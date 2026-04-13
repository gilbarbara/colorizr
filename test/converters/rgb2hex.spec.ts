import rgb2hex from '~/converters/rgb2hex';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2hex', () => {
  it.each([
    { input: brightPink.rgb, expected: brightPink.hex },
    { input: green.rgb, expected: green.hex },
    { input: orange.rgb, expected: orange.hex },
    { input: violet.rgb, expected: violet.hex },
    { input: yellow.rgb, expected: yellow.hex },
    { input: { r: 0, g: 0, b: 0 }, expected: '#000000' },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(rgb2hex(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.rgb) as ColorTuple, expected: brightPink.hex },
    { input: Object.values(green.rgb) as ColorTuple, expected: green.hex },
    { input: Object.values(orange.rgb) as ColorTuple, expected: orange.hex },
    { input: Object.values(violet.rgb) as ColorTuple, expected: violet.hex },
    { input: Object.values(yellow.rgb) as ColorTuple, expected: yellow.hex },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(rgb2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => rgb2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid color
    expect(() => rgb2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // invalid color
    expect(() => rgb2hex({ r: 500, g: 55, b: 75 })).toThrow('invalid color: rgb');
  });

  describe('alpha handling', () => {
    it.each([
      { input: { ...brightPink.rgb, alpha: alphaCases.semi }, expected: brightPink.hexAlpha },
      { input: { ...green.rgb, alpha: alphaCases.semi }, expected: green.hexAlpha },
    ])('$input should return $expected', ({ input, expected }) => {
      expect(rgb2hex(input)).toEqual(expected);
    });

    it('should not add alpha when alpha is 1', () => {
      expect(rgb2hex({ ...brightPink.rgb, alpha: alphaCases.opaque })).toBe(brightPink.hex);
    });

    it('should handle alpha=0 (fully transparent)', () => {
      expect(rgb2hex({ ...brightPink.rgb, alpha: alphaCases.transparent })).toBe('#ff004400');
    });

    it('should preserve alpha values close to 1', () => {
      expect(rgb2hex({ ...brightPink.rgb, alpha: alphaCases.nearOpaque })).toBe('#ff0044fc');
    });
  });
});
