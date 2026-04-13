import oklch2oklab from '~/converters/oklch2oklab';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2oklab', () => {
  it.each([
    { input: brightPink.oklchLong, expected: brightPink.oklabLong },
    { input: green.oklchLong, expected: green.oklabLong },
    { input: orange.oklchLong, expected: orange.oklabLong },
    { input: violet.oklchLong, expected: violet.oklabLong },
    { input: yellow.oklchLong, expected: yellow.oklabLong },
    {
      input: { l: 0, c: 0, h: 0 },
      expected: { l: 0, a: 0, b: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    const result = oklch2oklab(input);

    expect(result.l).toBeCloseTo(expected.l, 14);
    expect(result.a).toBeCloseTo(expected.a, 14);
    expect(result.b).toBeCloseTo(expected.b, 14);
  });

  it.each([
    { input: brightPink.oklch, expected: brightPink.oklab },
    { input: green.oklch, expected: green.oklab },
    { input: orange.oklch, expected: orange.oklab },
    { input: violet.oklch, expected: violet.oklab },
    { input: yellow.oklch, expected: yellow.oklab },
  ])('$input with precision should return $expected', ({ input, expected }) => {
    expect(oklch2oklab(input, 5)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.oklch) as ColorTuple, expected: brightPink.oklab },
    { input: Object.values(green.oklch) as ColorTuple, expected: green.oklab },
    { input: Object.values(orange.oklch) as ColorTuple, expected: orange.oklab },
    { input: Object.values(violet.oklch) as ColorTuple, expected: violet.oklab },
    { input: Object.values(yellow.oklch) as ColorTuple, expected: yellow.oklab },
  ])('$input with precision should return $expected', ({ input, expected }) => {
    expect(oklch2oklab(input, 5)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklch2oklab()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2oklab('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2oklab({ m: 255, p: 55, b: 75 })).toThrow('invalid color: oklch');
  });

  describe('alpha handling', () => {
    const expectedFromShort = oklch2oklab(brightPink.oklch);

    it('should preserve alpha from object input', () => {
      const result = oklch2oklab({ ...brightPink.oklch, alpha: alphaCases.semi });

      expect(result).toMatchObject(expectedFromShort);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = oklch2oklab({ ...brightPink.oklch, alpha: alphaCases.opaque });

      expect(result).toEqual(expectedFromShort);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = oklch2oklab({ ...brightPink.oklch, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...expectedFromShort, alpha: alphaCases.transparent });
    });
  });
});
