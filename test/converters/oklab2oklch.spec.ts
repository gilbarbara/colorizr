import oklab2oklch from '~/converters/oklab2oklch';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2oklch', () => {
  it.each([
    { input: brightPink.oklabLong, expected: brightPink.oklchLong },
    { input: green.oklabLong, expected: green.oklchLong },
    { input: orange.oklabLong, expected: orange.oklchLong },
    { input: violet.oklabLong, expected: violet.oklchLong },
    { input: yellow.oklabLong, expected: yellow.oklchLong },
    {
      input: { l: 0, a: 0, b: 0 },
      expected: { l: 0, c: 0, h: 0 },
    },
  ])('$input should return raw floats $expected', ({ input, expected }) => {
    expect(oklab2oklch(input)).toEqual(expected);
  });

  it.each([
    { input: brightPink.oklab, expected: { l: 0.63269, c: 0.25404, h: 19.90218 } },
    { input: green.oklab, expected: { l: 0.86876, c: 0.27606, h: 144.65534 } },
    { input: orange.oklab, expected: { l: 0.70622, c: 0.19819, h: 46.11008 } },
    { input: violet.oklab, expected: { l: 0.47642, c: 0.29956, h: 274.93693 } },
    { input: yellow.oklab, expected: { l: 0.92235, c: 0.14274, h: 97.77872 } },
  ])('$input with precision should return $expected', ({ input, expected }) => {
    expect(oklab2oklch(input, 5)).toEqual(expected);
  });

  it.each([
    {
      input: Object.values(brightPink.oklab) as ColorTuple,
      expected: { l: 0.63269, c: 0.25404, h: 19.90218 },
    },
    {
      input: Object.values(green.oklab) as ColorTuple,
      expected: { l: 0.86876, c: 0.27606, h: 144.65534 },
    },
    {
      input: Object.values(orange.oklab) as ColorTuple,
      expected: { l: 0.70622, c: 0.19819, h: 46.11008 },
    },
    {
      input: Object.values(violet.oklab) as ColorTuple,
      expected: { l: 0.47642, c: 0.29956, h: 274.93693 },
    },
    {
      input: Object.values(yellow.oklab) as ColorTuple,
      expected: { l: 0.92235, c: 0.14274, h: 97.77872 },
    },
  ])('$input with precision should return $expected', ({ input, expected }) => {
    expect(oklab2oklch(input, 5)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklab2oklch()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2oklch('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2oklch({ m: 255, p: 55, b: 75 })).toThrow('invalid color: oklab');
  });

  describe('alpha handling', () => {
    const expectedFromShort = oklab2oklch(brightPink.oklab);

    it('should preserve alpha from object input', () => {
      const result = oklab2oklch({ ...brightPink.oklab, alpha: alphaCases.semi });

      expect(result).toMatchObject(expectedFromShort);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = oklab2oklch({ ...brightPink.oklab, alpha: alphaCases.opaque });

      expect(result).toEqual(expectedFromShort);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = oklab2oklch({ ...brightPink.oklab, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...expectedFromShort, alpha: alphaCases.transparent });
    });
  });
});
