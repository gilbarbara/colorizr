import hex2oklch from '~/converters/hex2oklch';
import { MESSAGES } from '~/modules/constants';

import { HEX, LCH } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2oklch', () => {
  it.each([
    [brightPink.hex, brightPink.oklchLong],
    [green.hex, green.oklchLong],
    [orange.hex, orange.oklchLong],
    [violet.hex, violet.oklchLong],
    [yellow.hex, yellow.oklchLong],
    ['#000', { l: 0, c: 0, h: 0 }],
  ] as Array<[HEX, LCH]>)('%s should return %s', (input, expected) => {
    expect(hex2oklch(input)).toEqual(expected);
  });

  it('#fff should return approximately { l: 1, c: 0, h: 0 }', () => {
    const result = hex2oklch('#fff');

    expect(result.l).toBeCloseTo(1, 5);
    expect(result.c).toBeCloseTo(0, 5);
    expect(result.h).toBeCloseTo(0, 5);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hex2oklch()).toThrow(MESSAGES.inputHex);

    expect(() => hex2oklch('#mmxxvv')).toThrow(MESSAGES.inputHex);
    // @ts-expect-error - invalid parameters
    expect(() => hex2oklch([255, 255, 0])).toThrow(MESSAGES.inputHex);
  });

  describe('alpha handling', () => {
    it.each([
      [brightPink.hexAlpha, { ...brightPink.oklchLong, alpha: alphaCases.semi }],
      [green.hexAlpha, { ...green.oklchLong, alpha: alphaCases.semi }],
    ])('%s should return %s', (input, expected) => {
      expect(hex2oklch(input)).toEqual(expected);
    });

    it('should not include alpha for 6-char hex', () => {
      const result = hex2oklch(brightPink.hex);

      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hex2oklch('#ff004400');

      expect(result).toEqual({ ...brightPink.oklchLong, alpha: alphaCases.transparent });
    });
  });
});
