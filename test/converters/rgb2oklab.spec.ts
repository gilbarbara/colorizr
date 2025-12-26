import rgb2oklab from '~/converters/rgb2oklab';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LAB, RGB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2oklab', () => {
  it.each([
    [brightPink.rgb, brightPink.oklab],
    [green.rgb, green.oklab],
    [orange.rgb, orange.oklab],
    [violet.rgb, violet.oklab],
    [yellow.rgb, yellow.oklab],
  ] as Array<[RGB, LAB]>)('%s should return %s', (input, expected) => {
    expect(rgb2oklab(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.rgb), brightPink.oklab],
    [Object.values(green.rgb), green.oklab],
    [Object.values(orange.rgb), orange.oklab],
    [Object.values(violet.rgb), violet.oklab],
    [Object.values(yellow.rgb), yellow.oklab],
  ] as Array<[ColorTuple, LAB]>)('%s should return %s', (input, expected) => {
    expect(rgb2oklab(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => rgb2oklab()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2oklab('rgt(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2oklab({ m: 255, t: 55, p: 75 })).toThrow('invalid rgb color');
  });

  describe('alpha handling', () => {
    it('should preserve alpha from object input', () => {
      const result = rgb2oklab({ ...brightPink.rgb, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.oklab);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = rgb2oklab({ ...brightPink.rgb, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.oklab);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = rgb2oklab({ ...brightPink.rgb, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.oklab, alpha: alphaCases.transparent });
    });
  });
});
