import hex2oklab from '~/converters/hex2oklab';
import { MESSAGES } from '~/modules/constants';

import { HEX, LAB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2oklab', () => {
  it.each([
    [brightPink.hex, brightPink.oklabLong],
    [green.hex, green.oklabLong],
    [orange.hex, orange.oklabLong],
    [violet.hex, violet.oklabLong],
    [yellow.hex, yellow.oklabLong],
    ['#000', { l: 0, a: 0, b: 0 }],
  ] as Array<[HEX, LAB]>)('%s should return %s', (input, expected) => {
    expect(hex2oklab(input)).toEqual(expected);
  });

  it('#fff should return approximately { l: 1, a: 0, b: 0 }', () => {
    const result = hex2oklab('#fff');

    expect(result.l).toBeCloseTo(1, 5);
    expect(result.a).toBeCloseTo(0, 5);
    expect(result.b).toBeCloseTo(0, 5);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hex2oklab()).toThrow(MESSAGES.inputHex);
    // @ts-expect-error - invalid parameters
    expect(() => hex2oklab([255, 255, 0])).toThrow(MESSAGES.inputHex);
    expect(() => hex2oklab('#mmxxvv')).toThrow(MESSAGES.inputHex);
  });

  describe('alpha handling', () => {
    it.each([
      [brightPink.hexAlpha, { ...brightPink.oklabLong, alpha: alphaCases.semi }],
      [green.hexAlpha, { ...green.oklabLong, alpha: alphaCases.semi }],
    ])('%s should return %s', (input, expected) => {
      expect(hex2oklab(input)).toEqual(expected);
    });

    it('should not include alpha for 6-char hex', () => {
      const result = hex2oklab(brightPink.hex);

      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hex2oklab('#ff004400');

      expect(result).toEqual({ ...brightPink.oklabLong, alpha: alphaCases.transparent });
    });
  });
});
