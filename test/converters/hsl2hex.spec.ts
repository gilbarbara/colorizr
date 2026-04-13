import hsl2hex from '~/converters/hsl2hex';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2hex', () => {
  it.each([
    { input: brightPink.hsl, expected: brightPink.hex },
    { input: green.hsl, expected: green.hex },
    { input: orange.hsl, expected: orange.hex },
    { input: violet.hsl, expected: violet.hex },
    { input: yellow.hsl, expected: yellow.hex },
    { input: { h: 0, s: 0, l: 100 }, expected: '#ffffff' },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hsl2hex(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.hsl) as ColorTuple, expected: brightPink.hex },
    { input: Object.values(green.hsl) as ColorTuple, expected: green.hex },
    { input: Object.values(orange.hsl) as ColorTuple, expected: orange.hex },
    { input: Object.values(violet.hsl) as ColorTuple, expected: violet.hex },
    { input: Object.values(yellow.hsl) as ColorTuple, expected: yellow.hex },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hsl2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => hsl2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => hsl2hex({ m: 255, p: 55, b: 75 })).toThrow('invalid color: hsl');
  });

  describe('alpha handling', () => {
    it.each([
      { input: { ...brightPink.hsl, alpha: alphaCases.semi }, expected: brightPink.hexAlpha },
      { input: { ...green.hsl, alpha: alphaCases.semi }, expected: green.hexAlpha },
    ])('$input should return $expected', ({ input, expected }) => {
      expect(hsl2hex(input)).toEqual(expected);
    });

    it('should not add alpha when alpha is 1', () => {
      expect(hsl2hex({ ...brightPink.hsl, alpha: alphaCases.opaque })).toBe(brightPink.hex);
    });

    it('should handle alpha=0 (fully transparent)', () => {
      expect(hsl2hex({ ...brightPink.hsl, alpha: alphaCases.transparent })).toBe('#ff004400');
    });
  });
});
