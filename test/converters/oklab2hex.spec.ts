import oklab2hex from '~/converters/oklab2hex';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2hex', () => {
  it.each([
    { input: brightPink.oklab, expected: brightPink.hex },
    { input: green.oklab, expected: green.hex },
    { input: orange.oklab, expected: orange.hex },
    { input: violet.oklab, expected: violet.hex },
    { input: yellow.oklab, expected: yellow.hex },
    { input: { l: 0, a: 0, b: 0 }, expected: '#000000' },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklab2hex(input)).toEqual(expected);
  });

  it.each([
    { input: Object.values(brightPink.oklab) as ColorTuple, expected: brightPink.hex },
    { input: Object.values(green.oklab) as ColorTuple, expected: green.hex },
    { input: Object.values(orange.oklab) as ColorTuple, expected: orange.hex },
    { input: Object.values(violet.oklab) as ColorTuple, expected: violet.hex },
    { input: Object.values(yellow.oklab) as ColorTuple, expected: yellow.hex },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(oklab2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklab2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2hex({ m: 255, p: 55, b: 75 })).toThrow('invalid color: oklab');
  });

  describe('alpha handling', () => {
    it.each([
      { input: { ...brightPink.oklab, alpha: alphaCases.semi }, expected: brightPink.hexAlpha },
      { input: { ...green.oklab, alpha: alphaCases.semi }, expected: green.hexAlpha },
    ])('$input should return $expected', ({ input, expected }) => {
      expect(oklab2hex(input)).toEqual(expected);
    });

    it('should not add alpha when alpha is 1', () => {
      expect(oklab2hex({ ...brightPink.oklab, alpha: alphaCases.opaque })).toBe(brightPink.hex);
    });

    it('should handle alpha=0 (fully transparent)', () => {
      expect(oklab2hex({ ...brightPink.oklab, alpha: alphaCases.transparent })).toBe('#ff004400');
    });
  });
});
