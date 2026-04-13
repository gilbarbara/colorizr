import oklch2hex from '~/converters/oklch2hex';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2hex', () => {
  it.each([
    { input: brightPink.oklch, expected: brightPink.hex },
    { input: brightPink.oklchLong, expected: brightPink.hex },
    { input: green.oklch, expected: green.hex },
    { input: green.oklchLong, expected: green.hex },
    { input: orange.oklch, expected: orange.hex },
    { input: orange.oklchLong, expected: orange.hex },
    { input: violet.oklch, expected: violet.hex },
    { input: violet.oklchLong, expected: violet.hex },
    { input: yellow.oklch, expected: yellow.hex },
    { input: yellow.oklchLong, expected: yellow.hex },
    { input: { l: 0, c: 0, h: 0 }, expected: '#000000' },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklch2hex(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.oklch) as ColorTuple, expected: brightPink.hex },
    { input: Object.values(green.oklch) as ColorTuple, expected: green.hex },
    { input: Object.values(orange.oklch) as ColorTuple, expected: orange.hex },
    { input: Object.values(violet.oklch) as ColorTuple, expected: violet.hex },
    { input: Object.values(yellow.oklch) as ColorTuple, expected: yellow.hex },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklch2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklch2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2hex({ m: 255, p: 55, b: 75 })).toThrow('invalid color: oklch');
  });

  describe('alpha handling', () => {
    it.each([
      { input: { ...brightPink.oklch, alpha: alphaCases.semi }, expected: brightPink.hexAlpha },
      { input: { ...green.oklch, alpha: alphaCases.semi }, expected: green.hexAlpha },
    ])('$input should return $expected', ({ input, expected }) => {
      expect(oklch2hex(input)).toEqual(expected);
    });

    it('should not add alpha when alpha is 1', () => {
      expect(oklch2hex({ ...brightPink.oklch, alpha: alphaCases.opaque })).toBe(brightPink.hex);
    });

    it('should handle alpha=0 (fully transparent)', () => {
      expect(oklch2hex({ ...brightPink.oklch, alpha: alphaCases.transparent })).toBe('#ff004400');
    });
  });
});
