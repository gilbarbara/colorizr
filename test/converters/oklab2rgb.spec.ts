import oklab2rgb from '~/converters/oklab2rgb';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2rgb', () => {
  it.each([
    { input: brightPink.oklab, expected: brightPink.rgb },
    { input: brightPink.oklabLong, expected: brightPink.rgb },
    { input: green.oklab, expected: green.rgb },
    { input: green.oklabLong, expected: green.rgb },
    { input: orange.oklab, expected: orange.rgb },
    { input: orange.oklabLong, expected: orange.rgb },
    { input: violet.oklab, expected: violet.rgb },
    { input: violet.oklabLong, expected: violet.rgb },
    { input: yellow.oklab, expected: yellow.rgb },
    { input: yellow.oklabLong, expected: yellow.rgb },
    {
      input: { l: 0, a: 0, b: 0 },
      expected: { r: 0, g: 0, b: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklab2rgb(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.oklab) as ColorTuple, expected: brightPink.rgb },
    { input: Object.values(green.oklab) as ColorTuple, expected: green.rgb },
    { input: Object.values(orange.oklab) as ColorTuple, expected: orange.rgb },
    { input: Object.values(violet.oklab) as ColorTuple, expected: violet.rgb },
    { input: Object.values(yellow.oklab) as ColorTuple, expected: yellow.rgb },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklab2rgb(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklab2rgb()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2rgb('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2rgb({ m: 255, p: 55, b: 75 })).toThrow('invalid color: oklab');
  });

  describe('alpha handling', () => {
    it('should preserve alpha from object input', () => {
      const result = oklab2rgb({ ...brightPink.oklab, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.rgb);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = oklab2rgb({ ...brightPink.oklab, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.rgb);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = oklab2rgb({ ...brightPink.oklab, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.rgb, alpha: alphaCases.transparent });
    });
  });
});
