import { oklch2rgb } from '~/converters';
import { MESSAGES } from '~/modules/constants';
import parseCSS from '~/parse-css';
import toGamut from '~/to-gamut';

function isValidSRGB(color: string): boolean {
  const rgb = parseCSS(color, 'rgb');

  return rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255;
}

describe('toGamut', () => {
  describe('in-gamut colors', () => {
    it('should return in-gamut colors unchanged', () => {
      expect(toGamut('#ff0000')).toBe('#ff0000');
      expect(toGamut('#808080')).toBe('#808080');
      expect(toGamut('#000000')).toBe('#000000');
      expect(toGamut('#ffffff')).toBe('#ffffff');
    });

    it('should preserve format for in-gamut colors', () => {
      expect(toGamut('rgb(255, 0, 0)')).toBe('rgb(255 0 0)');
      expect(toGamut('hsl(0, 100%, 50%)')).toBe('hsl(0 100% 50%)');
    });
  });

  describe('out-of-gamut colors', () => {
    it('should map vivid oklch green into sRGB', () => {
      const result = toGamut('oklch(0.9 0.4 150)');

      expect(isValidSRGB(result)).toBe(true);
    });

    it('should map vivid oklch blue into sRGB', () => {
      const result = toGamut('oklch(0.5 0.4 260)');

      expect(isValidSRGB(result)).toBe(true);
    });

    it('should reduce chroma, not lightness', () => {
      const result = toGamut('oklch(0.7 0.4 150)');
      const mapped = parseCSS(result, 'oklch');

      // Lightness should be preserved
      expect(mapped.l).toBeCloseTo(0.7, 2);
      // Chroma should be reduced from 0.4
      expect(mapped.c).toBeLessThan(0.4);
      expect(mapped.c).toBeGreaterThan(0);
    });

    it('should preserve hue', () => {
      const result = toGamut('oklch(0.7 0.4 150)');
      const mapped = parseCSS(result, 'oklch');

      expect(mapped.h).toBeCloseTo(150, 0);
    });
  });

  describe('edge cases', () => {
    it('should return black for L <= 0', () => {
      expect(toGamut('oklch(0 0.3 120)', 'hex')).toBe('#000000');
      expect(toGamut('oklch(0 0.3 120)')).toBe('oklch(0% 0 none)');
    });

    it('should return white for L >= 1', () => {
      expect(toGamut('oklch(1 0.3 120)', 'hex')).toBe('#ffffff');
      expect(toGamut('oklch(1 0.3 120)')).toBe('oklch(100% 0 none)');
    });

    it('should be idempotent', () => {
      const first = toGamut('oklch(0.9 0.4 150)');
      const second = toGamut(first);

      expect(first).toBe(second);
    });

    it('should handle achromatic colors', () => {
      expect(toGamut('oklch(0.5 0 0)', 'hex')).toBe('#636363');
    });
  });

  describe('format option', () => {
    it('should allow format override', () => {
      const result = toGamut('oklch(0.9 0.4 150)', 'hsl');

      expect(result).toMatch(/^hsl\(/);
    });

    it('should preserve input format by default', () => {
      expect(toGamut('hsl(120, 100%, 50%)')).toMatch(/^hsl\(/);
      expect(toGamut('rgb(0, 255, 0)')).toMatch(/^rgb\(/);
      expect(toGamut('#00ff00')).toMatch(/^#/);
    });
  });

  describe('alpha handling', () => {
    it('should preserve alpha', () => {
      const result = toGamut('oklch(0.9 0.4 150 / 0.5)');

      expect(result).toContain('50%');
    });
  });

  describe('validation', () => {
    it('should fail with invalid input', () => {
      expect(() => toGamut('')).toThrow(MESSAGES.inputString);
      // @ts-expect-error - invalid parameters
      expect(() => toGamut(123)).toThrow(MESSAGES.inputString);
    });
  });

  describe('realistic out-of-gamut oklch colors', () => {
    const outOfGamutColors = [
      'oklch(0.9 0.4 150)', // vivid green
      'oklch(0.8 0.35 280)', // vivid purple
      'oklch(0.95 0.2 90)', // bright yellow
      'oklch(0.6 0.35 30)', // vivid red-orange
    ];

    it.each(outOfGamutColors)('should map %s to valid sRGB', input => {
      const result = toGamut(input);

      expect(isValidSRGB(result)).toBe(true);
    });

    it.each(outOfGamutColors)(
      'should produce different result than naive conversion for %s',
      input => {
        const lch = parseCSS(input, 'oklch');
        const naiveRgb = oklch2rgb(lch);

        // Naive conversion clips — gamut mapping should give better results
        const hasClipping =
          naiveRgb.r <= 0 ||
          naiveRgb.r >= 255 ||
          naiveRgb.g <= 0 ||
          naiveRgb.g >= 255 ||
          naiveRgb.b <= 0 ||
          naiveRgb.b >= 255;

        expect(hasClipping).toBe(true);
      },
    );
  });
});
