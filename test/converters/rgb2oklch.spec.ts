import rgb2oklch from '~/converters/rgb2oklch';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LCH, RGB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2oklch', () => {
  it.each([
    [brightPink.rgb, brightPink.oklchLong],
    [green.rgb, green.oklchLong],
    [orange.rgb, orange.oklchLong],
    [violet.rgb, violet.oklchLong],
    [yellow.rgb, yellow.oklchLong],
  ] as Array<[RGB, LCH]>)('%s should return %s', (input, expected) => {
    expect(rgb2oklch(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.rgb), brightPink.oklchLong],
    [Object.values(green.rgb), green.oklchLong],
    [Object.values(orange.rgb), orange.oklchLong],
    [Object.values(violet.rgb), violet.oklchLong],
    [Object.values(yellow.rgb), yellow.oklchLong],
  ] as Array<[ColorTuple, LCH]>)('%s should return %s', (input, expected) => {
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
