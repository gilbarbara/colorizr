import rgb2hsl from '~/converters/rgb2hsl';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2hsl', () => {
  it.each([
    { input: brightPink.rgb, expected: brightPink.hsl },
    { input: green.rgb, expected: green.hsl },
    { input: orange.rgb, expected: orange.hsl },
    { input: violet.rgb, expected: violet.hsl },
    { input: yellow.rgb, expected: yellow.hsl },
    {
      input: { r: 0, g: 0, b: 0 },
      expected: { h: 0, s: 0, l: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(rgb2hsl(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.rgb) as ColorTuple, expected: brightPink.hsl },
    { input: Object.values(green.rgb) as ColorTuple, expected: green.hsl },
    { input: Object.values(orange.rgb) as ColorTuple, expected: orange.hsl },
    { input: Object.values(violet.rgb) as ColorTuple, expected: violet.hsl },
    { input: Object.values(yellow.rgb) as ColorTuple, expected: yellow.hsl },
  ])('$input should return $expected', ({ input, expected }) => {
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
      {
        input: { ...brightPink.rgb, alpha: alphaCases.semi },
        expected: { ...brightPink.hsl, alpha: alphaCases.semi },
      },
      {
        input: { ...green.rgb, alpha: alphaCases.semi },
        expected: { ...green.hsl, alpha: alphaCases.semi },
      },
    ])('$input should return $expected', ({ input, expected }) => {
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
