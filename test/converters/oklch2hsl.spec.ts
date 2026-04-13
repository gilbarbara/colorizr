import oklch2hsl from '~/converters/oklch2hsl';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2hsl', () => {
  it.each([
    { input: brightPink.oklch, expected: brightPink.hsl },
    { input: brightPink.oklchLong, expected: brightPink.hsl },
    { input: green.oklch, expected: green.hsl },
    { input: green.oklchLong, expected: green.hsl },
    { input: orange.oklch, expected: orange.hsl },
    { input: orange.oklchLong, expected: orange.hsl },
    { input: violet.oklch, expected: violet.hsl },
    { input: violet.oklchLong, expected: violet.hsl },
    { input: yellow.oklch, expected: yellow.hsl },
    { input: yellow.oklchLong, expected: yellow.hsl },
    {
      input: { l: 0, c: 0, h: 0 },
      expected: { h: 0, s: 0, l: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklch2hsl(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.oklch) as ColorTuple, expected: brightPink.hsl },
    { input: Object.values(green.oklch) as ColorTuple, expected: green.hsl },
    { input: Object.values(orange.oklch) as ColorTuple, expected: orange.hsl },
    { input: Object.values(violet.oklch) as ColorTuple, expected: violet.hsl },
    { input: Object.values(yellow.oklch) as ColorTuple, expected: yellow.hsl },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklch2hsl(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklch2hsl()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2hsl('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2hsl({ m: 255, p: 55, b: 75 })).toThrow('invalid color: oklch');
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
