import apcaContrast from '~/apca';
import { MESSAGES } from '~/modules/constants';

describe('apcaContrast', () => {
  describe('official test values', () => {
    // Test values from SAPC-APCA official documentation
    // https://github.com/Myndex/SAPC-APCA

    it.each([
      { text: '#888888', bg: '#ffffff', expected: 63.056469930209424 },
      { text: '#ffffff', bg: '#888888', expected: -68.54146436644962 },
      { text: '#000000', bg: '#aaaaaa', expected: 58.146262578561334 },
      { text: '#aaaaaa', bg: '#000000', expected: -56.24113336839742 },
      { text: '#112233', bg: '#ddeeff', expected: 91.66830811481631 },
      { text: '#ddeeff', bg: '#112233', expected: -93.06770049484275 },
      { text: '#112233', bg: '#444444', expected: 8.32326136957393 },
      { text: '#444444', bg: '#112233', expected: -7.526878460278154 },
    ])('$text on $bg should return ~$expected', ({ text, bg, expected }) => {
      const result = apcaContrast(bg, text);

      // Allow small floating point differences (within 0.01)
      expect(result).toBeCloseTo(expected, 1);
    });
  });

  describe('polarity awareness', () => {
    it('should return positive values for dark text on light background', () => {
      const lc = apcaContrast('#ffffff', '#000000');

      expect(lc).toBeGreaterThan(0);
    });

    it('should return negative values for light text on dark background', () => {
      const lc = apcaContrast('#000000', '#ffffff');

      expect(lc).toBeLessThan(0);
    });

    it('should have asymmetric contrast values (polarity matters)', () => {
      const darkOnLight = apcaContrast('#fff', '#000');
      const lightOnDark = apcaContrast('#000', '#fff');

      // The absolute values should be different
      expect(Math.abs(darkOnLight)).not.toBeCloseTo(Math.abs(lightOnDark), 0);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for identical colors', () => {
      expect(apcaContrast('#888888', '#888888')).toBe(0);
      expect(apcaContrast('#ffffff', '#ffffff')).toBe(0);
      expect(apcaContrast('#000000', '#000000')).toBe(0);
    });

    it('should return 0 for very similar colors (below deltaYmin)', () => {
      // Very similar grays should return 0
      expect(apcaContrast('#808081', '#808080')).toBe(0);
    });

    it('should handle black correctly (soft clamp)', () => {
      // Pure black should still work due to soft clamp
      const lc = apcaContrast('#ffffff', '#000000');

      expect(lc).toBeGreaterThan(100);
    });
  });

  describe('contrast levels', () => {
    it('should produce high contrast for black/white combinations', () => {
      const lc = Math.abs(apcaContrast('#fff', '#000'));

      // Black on white should exceed 100 Lc
      expect(lc).toBeGreaterThan(100);
    });

    it('should produce lower contrast for similar colors', () => {
      const lc = Math.abs(apcaContrast('#888', '#666'));

      // Similar grays should have low contrast
      expect(lc).toBeLessThan(20);
    });
  });

  describe('CSS color format support', () => {
    it('should handle various CSS color formats', () => {
      // All of these should produce the same result for white on black
      const hexShort = apcaContrast('#000', '#fff');
      const hexLong = apcaContrast('#000000', '#ffffff');
      const rgb = apcaContrast('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
      const named = apcaContrast('black', 'white');

      expect(hexShort).toBeCloseTo(hexLong, 5);
      expect(hexLong).toBeCloseTo(rgb, 5);
      expect(rgb).toBeCloseTo(named, 5);
    });
  });

  describe('error handling', () => {
    it('should throw with invalid foreground', () => {
      // @ts-expect-error - invalid parameters
      expect(() => apcaContrast(123, '#fff')).toThrow(MESSAGES.inputString);
    });

    it('should throw with invalid background', () => {
      // @ts-expect-error - invalid parameters
      expect(() => apcaContrast('#fff', null)).toThrow(MESSAGES.inputString);
    });

    it('should throw with invalid color string', () => {
      expect(() => apcaContrast('notacolor', '#fff')).toThrow('invalid CSS string');
    });
  });
});
