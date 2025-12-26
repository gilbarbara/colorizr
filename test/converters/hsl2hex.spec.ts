import hsl2hex from '~/converters/hsl2hex';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2hex', () => {
  it.each([
    [brightPink.hsl, brightPink.hex],
    [green.hsl, green.hex],
    [orange.hsl, orange.hex],
    [violet.hsl, violet.hex],
    [yellow.hsl, yellow.hex],
    [{ h: 0, s: 0, l: 100 }, '#ffffff'],
  ])('%s should return %s', (input, expected) => {
    expect(hsl2hex(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.hsl), brightPink.hex],
    [Object.values(green.hsl), green.hex],
    [Object.values(orange.hsl), orange.hex],
    [Object.values(violet.hsl), violet.hex],
    [Object.values(yellow.hsl), yellow.hex],
  ] as Array<[ColorTuple, string]>)('%s should return %s', (input, expected) => {
    expect(hsl2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => hsl2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => hsl2hex({ m: 255, p: 55, b: 75 })).toThrow('invalid hsl color');
  });

  describe('alpha handling', () => {
    it.each([
      [{ ...brightPink.hsl, alpha: alphaCases.semi }, brightPink.hexAlpha],
      [{ ...green.hsl, alpha: alphaCases.semi }, green.hexAlpha],
    ])('%s should return %s', (input, expected) => {
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
