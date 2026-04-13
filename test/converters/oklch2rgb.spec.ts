import oklch2rgb from '~/converters/oklch2rgb';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2rgb', () => {
  it.each([
    { input: brightPink.oklch, expected: brightPink.rgb },
    { input: brightPink.oklchLong, expected: brightPink.rgb },
    { input: green.oklch, expected: green.rgb },
    { input: green.oklchLong, expected: green.rgb },
    { input: orange.oklch, expected: orange.rgb },
    { input: orange.oklchLong, expected: orange.rgb },
    { input: violet.oklch, expected: violet.rgb },
    { input: violet.oklchLong, expected: violet.rgb },
    { input: yellow.oklch, expected: yellow.rgb },
    { input: yellow.oklchLong, expected: yellow.rgb },
    {
      input: { l: 0, c: 0, h: 0 },
      expected: { r: 0, g: 0, b: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklch2rgb(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.oklch) as ColorTuple, expected: brightPink.rgb },
    { input: Object.values(green.oklch) as ColorTuple, expected: green.rgb },
    { input: Object.values(orange.oklch) as ColorTuple, expected: orange.rgb },
    { input: Object.values(violet.oklch) as ColorTuple, expected: violet.rgb },
    { input: Object.values(yellow.oklch) as ColorTuple, expected: yellow.rgb },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklch2rgb(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklch2rgb()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2rgb('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2rgb({ m: 255, p: 55, b: 75 })).toThrow('invalid color: oklch');
  });

  describe('alpha handling', () => {
    it('should preserve alpha from object input', () => {
      const result = oklch2rgb({ ...brightPink.oklch, alpha: alphaCases.semi });

      expect(result).toMatchObject(brightPink.rgb);
      expect(result.alpha).toBe(alphaCases.semi);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = oklch2rgb({ ...brightPink.oklch, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.rgb);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = oklch2rgb({ ...brightPink.oklch, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.rgb, alpha: alphaCases.transparent });
    });
  });
});
