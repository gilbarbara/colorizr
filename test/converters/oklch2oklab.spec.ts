import oklch2oklab from '~/converters/oklch2oklab';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LAB, LCH } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2oklab', () => {
  it.each([
    [brightPink.oklch, brightPink.oklab],
    [brightPink.oklchLong, brightPink.oklab],
    [green.oklch, green.oklab],
    [green.oklchLong, green.oklab],
    [orange.oklch, orange.oklab],
    [orange.oklchLong, orange.oklab],
    [violet.oklch, violet.oklab],
    [violet.oklchLong, violet.oklab],
    [yellow.oklch, yellow.oklab],
    [yellow.oklchLong, yellow.oklab],
    [
      { l: 0, c: 0, h: 0 },
      { l: 0, a: 0, b: 0 },
    ],
  ] as Array<[LCH, LAB]>)('%s should return %s', (input, expected) => {
    expect(oklch2oklab(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklch), brightPink.oklab],
    [Object.values(green.oklch), green.oklab],
    [Object.values(orange.oklch), orange.oklab],
    [Object.values(violet.oklch), violet.oklab],
    [Object.values(yellow.oklch), yellow.oklab],
  ] as Array<[ColorTuple, LAB]>)('%s should return %s', (input, expected) => {
    expect(oklch2oklab(input)).toEqual(expected);
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
    it('should preserve alpha from object input', () => {
      const result = oklch2oklab({ ...brightPink.oklch, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.oklab);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = oklch2oklab({ ...brightPink.oklch, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.oklab);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = oklch2oklab({ ...brightPink.oklch, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.oklab, alpha: alphaCases.transparent });
    });
  });
});
