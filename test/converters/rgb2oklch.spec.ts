import rgb2oklch from '~/converters/rgb2oklch';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2oklch', () => {
  it.each([
    { input: brightPink.rgb, expected: brightPink.oklchLong },
    { input: green.rgb, expected: green.oklchLong },
    { input: orange.rgb, expected: orange.oklchLong },
    { input: violet.rgb, expected: violet.oklchLong },
    { input: yellow.rgb, expected: yellow.oklchLong },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(rgb2oklch(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.rgb) as ColorTuple, expected: brightPink.oklchLong },
    { input: Object.values(green.rgb) as ColorTuple, expected: green.oklchLong },
    { input: Object.values(orange.rgb) as ColorTuple, expected: orange.oklchLong },
    { input: Object.values(violet.rgb) as ColorTuple, expected: violet.oklchLong },
    { input: Object.values(yellow.rgb) as ColorTuple, expected: yellow.oklchLong },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(rgb2oklch(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => rgb2oklch()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2oklch('rgt(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2oklch({ m: 255, t: 55, p: 75 })).toThrow('invalid color: rgb');
  });

  describe('alpha handling', () => {
    it('should preserve alpha from object input', () => {
      const result = rgb2oklch({ ...brightPink.rgb, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.oklchLong);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = rgb2oklch({ ...brightPink.rgb, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.oklchLong);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = rgb2oklch({ ...brightPink.rgb, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.oklchLong, alpha: alphaCases.transparent });
    });
  });
});
