import rgb2oklab from '~/converters/rgb2oklab';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2oklab', () => {
  it.each([
    { input: brightPink.rgb, expected: brightPink.oklabLong },
    { input: green.rgb, expected: green.oklabLong },
    { input: orange.rgb, expected: orange.oklabLong },
    { input: violet.rgb, expected: violet.oklabLong },
    { input: yellow.rgb, expected: yellow.oklabLong },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(rgb2oklab(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.rgb) as ColorTuple, expected: brightPink.oklabLong },
    { input: Object.values(green.rgb) as ColorTuple, expected: green.oklabLong },
    { input: Object.values(orange.rgb) as ColorTuple, expected: orange.oklabLong },
    { input: Object.values(violet.rgb) as ColorTuple, expected: violet.oklabLong },
    { input: Object.values(yellow.rgb) as ColorTuple, expected: yellow.oklabLong },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(rgb2oklab(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => rgb2oklab()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2oklab('rgt(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2oklab({ m: 255, t: 55, p: 75 })).toThrow('invalid color: rgb');
  });

  describe('alpha handling', () => {
    it('should preserve alpha from object input', () => {
      const result = rgb2oklab({ ...brightPink.rgb, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.oklabLong);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = rgb2oklab({ ...brightPink.rgb, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.oklabLong);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = rgb2oklab({ ...brightPink.rgb, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.oklabLong, alpha: alphaCases.transparent });
    });
  });
});
