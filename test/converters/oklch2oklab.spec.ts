import oklch2oklab from '~/converters/oklch2oklab';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LAB, LCH } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2oklab', () => {
  it.each([
    [brightPink.oklchLong, brightPink.oklabLong],
    [green.oklchLong, green.oklabLong],
    [orange.oklchLong, orange.oklabLong],
    [violet.oklchLong, violet.oklabLong],
    [yellow.oklchLong, yellow.oklabLong],
    [
      { l: 0, c: 0, h: 0 },
      { l: 0, a: 0, b: 0 },
    ],
  ] as Array<[LCH, LAB]>)('%s should return %s', (input, expected) => {
    const result = oklch2oklab(input);

    expect(result.l).toBeCloseTo(expected.l, 14);
    expect(result.a).toBeCloseTo(expected.a, 14);
    expect(result.b).toBeCloseTo(expected.b, 14);
  });

  it.each([
    [brightPink.oklch, brightPink.oklab],
    [green.oklch, green.oklab],
    [orange.oklch, orange.oklab],
    [violet.oklch, violet.oklab],
    [yellow.oklch, yellow.oklab],
  ] as Array<[LCH, LAB]>)('%s with precision should return %s', (input, expected) => {
    expect(oklch2oklab(input, 5)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklch) as ColorTuple, brightPink.oklab],
    [Object.values(green.oklch) as ColorTuple, green.oklab],
    [Object.values(orange.oklch) as ColorTuple, orange.oklab],
    [Object.values(violet.oklch) as ColorTuple, violet.oklab],
    [Object.values(yellow.oklch) as ColorTuple, yellow.oklab],
  ] as Array<[ColorTuple, LAB]>)('%s with precision should return %s', (input, expected) => {
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
