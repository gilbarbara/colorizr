import rgb2hsl from '~/converters/rgb2hsl';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, HSL, RGB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2hsl', () => {
  it.each([
    [brightPink.rgb, brightPink.hsl],
    [green.rgb, green.hsl],
    [orange.rgb, orange.hsl],
    [violet.rgb, violet.hsl],
    [yellow.rgb, yellow.hsl],
    [
      { r: 0, g: 0, b: 0 },
      { h: 0, s: 0, l: 0 },
    ],
  ] as Array<[RGB, HSL]>)('%s should return %s', (input, expected) => {
    expect(rgb2hsl(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.rgb), brightPink.hsl],
    [Object.values(green.rgb), green.hsl],
    [Object.values(orange.rgb), orange.hsl],
    [Object.values(violet.rgb), violet.hsl],
    [Object.values(yellow.rgb), yellow.hsl],
  ] as Array<[ColorTuple, HSL]>)('%s should return %s', (input, expected) => {
    expect(rgb2hsl(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => rgb2hsl()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2hsl('rgt(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => rgb2hsl({ m: 255, t: 55, p: 75 })).toThrow('invalid color: rgb');
  });

  describe('alpha handling', () => {
    it.each([
      [
        { ...brightPink.rgb, alpha: alphaCases.semi },
        { ...brightPink.hsl, alpha: alphaCases.semi },
      ],
      [
        { ...green.rgb, alpha: alphaCases.semi },
        { ...green.hsl, alpha: alphaCases.semi },
      ],
    ])('%s should return %s', (input, expected) => {
      expect(rgb2hsl(input)).toEqual(expected);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = rgb2hsl({ ...brightPink.rgb, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.hsl);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = rgb2hsl({ ...brightPink.rgb, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.hsl, alpha: alphaCases.transparent });
    });
  });
});
