import hex2rgb from '~/converters/hex2rgb';
import { MESSAGES } from '~/modules/constants';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2rgb', () => {
  it.each([
    { input: brightPink.hex, expected: brightPink.rgb },
    { input: green.hex, expected: green.rgb },
    { input: orange.hex, expected: orange.rgb },
    { input: violet.hex, expected: violet.rgb },
    { input: yellow.hex, expected: yellow.rgb },
    { input: '#fff', expected: { r: 255, g: 255, b: 255 } },
    { input: '#000', expected: { r: 0, g: 0, b: 0 } },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(hex2rgb(input)).toEqual(expected);
  });

  it('should throw with invalid input', () => {
    expect(() => hex2rgb('abs')).toThrow(MESSAGES.inputHex);
    // @ts-expect-error - invalid parameters
    expect(() => hex2rgb({ h: 240, s: 45, l: 50 })).toThrow(MESSAGES.inputHex);
  });

  describe('alpha handling', () => {
    it.each([
      { input: brightPink.hexAlpha, expected: { ...brightPink.rgb, alpha: alphaCases.semi } },
      { input: green.hexAlpha, expected: { ...green.rgb, alpha: alphaCases.semi } },
    ])('$input should return $expected', ({ input, expected }) => {
      expect(hex2rgb(input)).toEqual(expected);
    });

    it('should not include alpha for 6-char hex', () => {
      const result = hex2rgb(brightPink.hex);

      expect(result).not.toHaveProperty('alpha');
    });

    it('should not include alpha for fully opaque 8-char hex', () => {
      const result = hex2rgb('#ff0044ff');

      expect(result).toEqual(brightPink.rgb);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hex2rgb('#ff004400');

      expect(result).toEqual({ ...brightPink.rgb, alpha: alphaCases.transparent });
    });
  });
});
