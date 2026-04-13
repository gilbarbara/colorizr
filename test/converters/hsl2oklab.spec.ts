import hsl2oklab from '~/converters/hsl2oklab';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2oklab', () => {
  it.each([
    { input: brightPink.hsl, expected: brightPink.oklabLong },
    { input: green.hsl, expected: green.oklabLong },
    { input: orange.hsl, expected: orange.oklabLong },
    { input: violet.hsl, expected: violet.oklabLong },
    { input: yellow.hsl, expected: yellow.oklabLong },
    {
      input: { h: 0, s: 0, l: 0 },
      expected: { l: 0, a: 0, b: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hsl2oklab(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.hsl) as ColorTuple, expected: brightPink.oklabLong },
    { input: Object.values(green.hsl) as ColorTuple, expected: green.oklabLong },
    { input: Object.values(orange.hsl) as ColorTuple, expected: orange.oklabLong },
    { input: Object.values(violet.hsl) as ColorTuple, expected: violet.oklabLong },
    { input: Object.values(yellow.hsl) as ColorTuple, expected: yellow.oklabLong },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hsl2oklab(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2oklab()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2oklab('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2oklab({ m: 255, p: 55, b: 75 })).toThrow('invalid color: hsl');
  });

  describe('alpha handling', () => {
    it('should preserve alpha through conversion chain', () => {
      const result = hsl2oklab({ ...brightPink.hsl, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.oklabLong);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = hsl2oklab({ ...brightPink.hsl, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.oklabLong);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hsl2oklab({ ...brightPink.hsl, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.oklabLong, alpha: alphaCases.transparent });
    });
  });
});
