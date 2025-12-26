import oklch2hsl from '~/converters/oklch2hsl';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, HSL, LCH } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2hsl', () => {
  it.each([
    [brightPink.oklch, brightPink.hsl],
    [brightPink.oklchLong, brightPink.hsl],
    [green.oklch, green.hsl],
    [green.oklchLong, green.hsl],
    [orange.oklch, orange.hsl],
    [orange.oklchLong, orange.hsl],
    [violet.oklch, violet.hsl],
    [violet.oklchLong, violet.hsl],
    [yellow.oklch, yellow.hsl],
    [yellow.oklchLong, yellow.hsl],
    [
      { l: 0, c: 0, h: 0 },
      { h: 0, s: 0, l: 0 },
    ],
  ] as Array<[LCH, HSL]>)('%s should return %s', (input, expected) => {
    expect(oklch2hsl(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklch), brightPink.hsl],
    [Object.values(green.oklch), green.hsl],
    [Object.values(orange.oklch), orange.hsl],
    [Object.values(violet.oklch), violet.hsl],
    [Object.values(yellow.oklch), yellow.hsl],
  ] as Array<[ColorTuple, HSL]>)('%s should return %s', (input, expected) => {
    expect(oklch2hsl(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklch2hsl()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2hsl('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2hsl({ m: 255, p: 55, b: 75 })).toThrow('invalid oklch color');
  });

  describe('alpha handling', () => {
    it('should preserve alpha through conversion chain', () => {
      const result = oklch2hsl({ ...brightPink.oklch, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.hsl);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = oklch2hsl({ ...brightPink.oklch, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.hsl);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = oklch2hsl({ ...brightPink.oklch, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.hsl, alpha: alphaCases.transparent });
    });
  });
});
