import hsl2oklab from '~/converters/hsl2oklab';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, HSL, LAB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2oklab', () => {
  it.each([
    [brightPink.hsl, brightPink.oklabLong],
    [green.hsl, green.oklabLong],
    [orange.hsl, orange.oklabLong],
    [violet.hsl, violet.oklabLong],
    [yellow.hsl, yellow.oklabLong],
    [
      { h: 0, s: 0, l: 0 },
      { l: 0, a: 0, b: 0 },
    ],
  ] as Array<[HSL, LAB]>)('%s should return %s', (input, expected) => {
    expect(hsl2oklab(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.hsl), brightPink.oklabLong],
    [Object.values(green.hsl), green.oklabLong],
    [Object.values(orange.hsl), orange.oklabLong],
    [Object.values(violet.hsl), violet.oklabLong],
    [Object.values(yellow.hsl), yellow.oklabLong],
  ] as Array<[ColorTuple, LAB]>)('%s should return %s', (input, expected) => {
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
