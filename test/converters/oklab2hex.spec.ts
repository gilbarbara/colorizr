import oklab2hex from '~/converters/oklab2hex';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, HEX, LAB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2hex', () => {
  it.each([
    [brightPink.oklab, brightPink.hex],
    [green.oklab, green.hex],
    [orange.oklab, orange.hex],
    [violet.oklab, violet.hex],
    [yellow.oklab, yellow.hex],
    [{ l: 0, a: 0, b: 0 }, '#000000'],
  ] as Array<[LAB, HEX]>)('%s should return %s', (input, expected) => {
    expect(oklab2hex(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklab), brightPink.hex],
    [Object.values(green.oklab), green.hex],
    [Object.values(orange.oklab), orange.hex],
    [Object.values(violet.oklab), violet.hex],
    [Object.values(yellow.oklab), yellow.hex],
  ] as Array<[ColorTuple, string]>)('%s should return %s', (input, expected) => {
    expect(oklab2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklab2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2hex({ m: 255, p: 55, b: 75 })).toThrow('invalid oklab color');
  });

  describe('alpha handling', () => {
    it.each([
      [{ ...brightPink.oklab, alpha: alphaCases.semi }, brightPink.hexAlpha],
      [{ ...green.oklab, alpha: alphaCases.semi }, green.hexAlpha],
    ])('%s should return %s', (input, expected) => {
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
