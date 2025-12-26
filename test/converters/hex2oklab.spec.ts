import hex2oklab from '~/converters/hex2oklab';
import { MESSAGES } from '~/modules/constants';

import { HEX, LAB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2oklab', () => {
  it.each([
    [brightPink.hex, brightPink.oklab],
    [green.hex, green.oklab],
    [orange.hex, orange.oklab],
    [violet.hex, violet.oklab],
    [yellow.hex, yellow.oklab],
    ['#fff', { l: 1, a: 0, b: 0 }],
    ['#000', { l: 0, a: 0, b: 0 }],
  ] as Array<[HEX, LAB]>)('%s should return %s', (input, expected) => {
    expect(hex2oklab(input)).toEqual(expected);
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
      [brightPink.hexAlpha, { ...brightPink.oklab, alpha: alphaCases.semi }],
      [green.hexAlpha, { ...green.oklab, alpha: alphaCases.semi }],
    ])('%s should return %s', (input, expected) => {
      expect(hex2oklab(input)).toEqual(expected);
    });

    it('should not include alpha for 6-char hex', () => {
      const result = hex2oklab(brightPink.hex);

      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hex2oklab('#ff004400');

      expect(result).toEqual({ ...brightPink.oklab, alpha: alphaCases.transparent });
    });
  });
});
