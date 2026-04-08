import oklab2oklch from '~/converters/oklab2oklch';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LAB, LCH } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2oklch', () => {
  it.each([
    [brightPink.oklabLong, brightPink.oklchLong],
    [green.oklabLong, green.oklchLong],
    [orange.oklabLong, orange.oklchLong],
    [violet.oklabLong, violet.oklchLong],
    [yellow.oklabLong, yellow.oklchLong],
    [
      { l: 0, a: 0, b: 0 },
      { l: 0, c: 0, h: 0 },
    ],
  ] as Array<[LAB, LCH]>)('%s should return raw floats %s', (input, expected) => {
    expect(oklab2oklch(input)).toEqual(expected);
  });

  it.each([
    [brightPink.oklab, { l: 0.63269, c: 0.25404, h: 19.90218 }],
    [green.oklab, { l: 0.86876, c: 0.27606, h: 144.65534 }],
    [orange.oklab, { l: 0.70622, c: 0.19819, h: 46.11008 }],
    [violet.oklab, { l: 0.47642, c: 0.29956, h: 274.93693 }],
    [yellow.oklab, { l: 0.92235, c: 0.14274, h: 97.77872 }],
  ] as Array<[LAB, LCH]>)('%s with precision should return %s', (input, expected) => {
    expect(oklab2oklch(input, 5)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklab) as ColorTuple, { l: 0.63269, c: 0.25404, h: 19.90218 }],
    [Object.values(green.oklab) as ColorTuple, { l: 0.86876, c: 0.27606, h: 144.65534 }],
    [Object.values(orange.oklab) as ColorTuple, { l: 0.70622, c: 0.19819, h: 46.11008 }],
    [Object.values(violet.oklab) as ColorTuple, { l: 0.47642, c: 0.29956, h: 274.93693 }],
    [Object.values(yellow.oklab) as ColorTuple, { l: 0.92235, c: 0.14274, h: 97.77872 }],
  ] as Array<[ColorTuple, LCH]>)('%s with precision should return %s', (input, expected) => {
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
