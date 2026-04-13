import hex2hsl from '~/converters/hex2hsl';
import { MESSAGES } from '~/modules/constants';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2hsl', () => {
  it.each([
    { input: brightPink.hex, expected: brightPink.hsl },
    { input: green.hex, expected: green.hsl },
    { input: orange.hex, expected: orange.hsl },
    { input: violet.hex, expected: violet.hsl },
    { input: yellow.hex, expected: yellow.hsl },
    { input: '#fff', expected: { h: 0, s: 0, l: 100 } },
    { input: '#000', expected: { h: 0, s: 0, l: 0 } },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hex2hsl(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hex2hsl()).toThrow(MESSAGES.inputHex);
    // @ts-expect-error - invalid parameters
    expect(() => hex2hsl([255, 255, 0])).toThrow(MESSAGES.inputHex);
    expect(() => hex2hsl('#mmxxvv')).toThrow(MESSAGES.inputHex);
  });

  describe('alpha handling', () => {
    it.each([
      { input: brightPink.hexAlpha, expected: { ...brightPink.hsl, alpha: alphaCases.semi } },
      { input: green.hexAlpha, expected: { ...green.hsl, alpha: alphaCases.semi } },
    ])('$input should return $expected', ({ input, expected }) => {
      expect(hex2hsl(input)).toEqual(expected);
    });

    it('should not include alpha for 6-char hex', () => {
      const result = hex2hsl(brightPink.hex);

      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hex2hsl('#ff004400');

      expect(result).toEqual({ ...brightPink.hsl, alpha: alphaCases.transparent });
    });
  });
});
