import oklab2hsl from '~/converters/oklab2hsl';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2hsl', () => {
  it.each([
    { input: brightPink.oklab, expected: brightPink.hsl },
    { input: green.oklab, expected: green.hsl },
    { input: orange.oklab, expected: orange.hsl },
    { input: violet.oklab, expected: violet.hsl },
    { input: yellow.oklab, expected: yellow.hsl },
    {
      input: { l: 0, a: 0, b: 0 },
      expected: { h: 0, s: 0, l: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklab2hsl(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.oklab) as ColorTuple, expected: brightPink.hsl },
    { input: Object.values(green.oklab) as ColorTuple, expected: green.hsl },
    { input: Object.values(orange.oklab) as ColorTuple, expected: orange.hsl },
    { input: Object.values(violet.oklab) as ColorTuple, expected: violet.hsl },
    { input: Object.values(yellow.oklab) as ColorTuple, expected: yellow.hsl },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklab2hsl(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklab2hsl()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2hsl('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2hsl({ m: 255, p: 55, b: 75 })).toThrow('invalid color: oklab');
  });

  describe('alpha handling', () => {
    it('should preserve alpha through conversion chain', () => {
      const result = oklab2hsl({ ...brightPink.oklab, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.hsl);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = oklab2hsl({ ...brightPink.oklab, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.hsl);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = oklab2hsl({ ...brightPink.oklab, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.hsl, alpha: alphaCases.transparent });
    });
  });
});
