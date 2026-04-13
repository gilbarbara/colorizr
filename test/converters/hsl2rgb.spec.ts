import hsl2rgb from '~/converters/hsl2rgb';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2rgb', () => {
  it.each([
    { input: brightPink.hsl, expected: brightPink.rgb },
    { input: green.hsl, expected: green.rgb },
    { input: orange.hsl, expected: orange.rgb },
    { input: violet.hsl, expected: violet.rgb },
    { input: yellow.hsl, expected: yellow.rgb },
    {
      input: { h: 0, s: 0, l: 0 },
      expected: { r: 0, g: 0, b: 0 },
    },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hsl2rgb(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.hsl) as ColorTuple, expected: brightPink.rgb },
    { input: Object.values(green.hsl) as ColorTuple, expected: green.rgb },
    { input: Object.values(orange.hsl) as ColorTuple, expected: orange.rgb },
    { input: Object.values(violet.hsl) as ColorTuple, expected: violet.rgb },
    { input: Object.values(yellow.hsl) as ColorTuple, expected: yellow.rgb },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hsl2rgb(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2rgb()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2rgb('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2rgb({ m: 255, p: 55, b: 75 })).toThrow('invalid color: hsl');
  });

  describe('alpha handling', () => {
    it.each([
      {
        input: { ...brightPink.hsl, alpha: alphaCases.semi },
        expected: { ...brightPink.rgb, alpha: alphaCases.semi },
      },
      {
        input: { ...green.hsl, alpha: alphaCases.semi },
        expected: { ...green.rgb, alpha: alphaCases.semi },
      },
    ])('$input should return $expected', ({ input, expected }) => {
      expect(hsl2rgb(input)).toEqual(expected);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = hsl2rgb({ ...brightPink.hsl, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.rgb);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hsl2rgb({ ...brightPink.hsl, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.rgb, alpha: alphaCases.transparent });
    });
  });
});
