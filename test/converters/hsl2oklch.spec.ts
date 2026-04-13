import hsl2oklch from '~/converters/hsl2oklch';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2oklch', () => {
  it.each([
    { input: brightPink.hsl, expected: brightPink.oklchLong },
    { input: green.hsl, expected: green.oklchLong },
    { input: orange.hsl, expected: orange.oklchLong },
    { input: violet.hsl, expected: violet.oklchLong },
    { input: yellow.hsl, expected: yellow.oklchLong },
    {
      input: { h: 0, s: 0, l: 0 },
      expected: { l: 0, c: 0, h: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hsl2oklch(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.hsl) as ColorTuple, expected: brightPink.oklchLong },
    { input: Object.values(green.hsl) as ColorTuple, expected: green.oklchLong },
    { input: Object.values(orange.hsl) as ColorTuple, expected: orange.oklchLong },
    { input: Object.values(violet.hsl) as ColorTuple, expected: violet.oklchLong },
    { input: Object.values(yellow.hsl) as ColorTuple, expected: yellow.oklchLong },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hsl2oklch(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2oklch()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => hsl2oklch('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2oklch({ m: 255, p: 55, b: 75 })).toThrow('invalid color: hsl');
  });

  describe('alpha handling', () => {
    it('should preserve alpha through conversion chain', () => {
      const result = hsl2oklch({ ...brightPink.hsl, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.oklchLong);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = hsl2oklch({ ...brightPink.hsl, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.oklchLong);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hsl2oklch({ ...brightPink.hsl, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.oklchLong, alpha: alphaCases.transparent });
    });
  });
});
