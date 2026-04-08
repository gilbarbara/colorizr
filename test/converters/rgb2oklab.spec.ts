import rgb2oklab from '~/converters/rgb2oklab';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LAB, RGB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2oklab', () => {
  it.each([
    [brightPink.rgb, brightPink.oklabLong],
    [green.rgb, green.oklabLong],
    [orange.rgb, orange.oklabLong],
    [violet.rgb, violet.oklabLong],
    [yellow.rgb, yellow.oklabLong],
  ] as Array<[RGB, LAB]>)('%s should return %s', (input, expected) => {
    expect(rgb2oklab(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.rgb), brightPink.oklabLong],
    [Object.values(green.rgb), green.oklabLong],
    [Object.values(orange.rgb), orange.oklabLong],
    [Object.values(violet.rgb), violet.oklabLong],
    [Object.values(yellow.rgb), yellow.oklabLong],
  ] as Array<[ColorTuple, LAB]>)('%s should return %s', (input, expected) => {
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
