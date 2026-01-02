import rgb2oklch from '~/converters/rgb2oklch';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LCH, RGB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2oklch', () => {
  it.each([
    [brightPink.rgb, brightPink.oklch],
    [green.rgb, green.oklch],
    [orange.rgb, orange.oklch],
    [violet.rgb, violet.oklch],
    [yellow.rgb, yellow.oklch],
  ] as Array<[RGB, LCH]>)('%s should return %s', (input, expected) => {
    expect(rgb2oklch(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.rgb), brightPink.oklch],
    [Object.values(green.rgb), green.oklch],
    [Object.values(orange.rgb), orange.oklch],
    [Object.values(violet.rgb), violet.oklch],
    [Object.values(yellow.rgb), yellow.oklch],
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

      expect(result).toMatchObject(brightPink.oklch);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = rgb2oklch({ ...brightPink.rgb, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.oklch);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = rgb2oklch({ ...brightPink.rgb, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.oklch, alpha: alphaCases.transparent });
    });
  });
});
