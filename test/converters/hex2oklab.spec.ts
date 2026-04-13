import hex2oklab from '~/converters/hex2oklab';
import { MESSAGES } from '~/modules/constants';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2oklab', () => {
  it.each([
    { input: brightPink.hex, expected: brightPink.oklabLong },
    { input: green.hex, expected: green.oklabLong },
    { input: orange.hex, expected: orange.oklabLong },
    { input: violet.hex, expected: violet.oklabLong },
    { input: yellow.hex, expected: yellow.oklabLong },
    { input: '#000', expected: { l: 0, a: 0, b: 0 } },
  ])('$input should return $expected', ({ input, expected }) => {
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
      { input: brightPink.hexAlpha, expected: { ...brightPink.oklabLong, alpha: alphaCases.semi } },
      { input: green.hexAlpha, expected: { ...green.oklabLong, alpha: alphaCases.semi } },
    ])('$input should return $expected', ({ input, expected }) => {
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
