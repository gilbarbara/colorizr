import { MESSAGES } from '~/modules/constants';
import readableColor from '~/readable-color';

describe('readableColor', () => {
  describe('method: yiq (default)', () => {
    it.each([
      { input: '#ff0044', expected: '#ffffff', options: {} },
      { input: '#9900ff', expected: '#ffffff', options: { threshold: 168 } },
      { input: '#f94fff', expected: '#ffffff', options: { threshold: 164 } },
      { input: '#07ff00', expected: '#000000', options: {} },
      { input: '#afff26', expected: '#333', options: { darkColor: '#333' } },
      { input: '#fff800', expected: '#000000', options: {} },
      { input: '#005cff', expected: '#ffffff', options: {} },
      { input: '#2a00ff', expected: '#91b6ff', options: { lightColor: '#91b6ff' } },
      { input: '#a300ff', expected: '#ffffff' },
    ])('should return $expected for $input', ({ input, expected, options }) => {
      expect(readableColor(input, options)).toBe(expected);
    });

    it('should throw with invalid threshold', () => {
      expect(() => readableColor('#fff', { threshold: 300 })).toThrow(MESSAGES.threshold);
      expect(() => readableColor('#fff', { threshold: -1 })).toThrow(MESSAGES.threshold);
    });
  });

  describe('method: wcag', () => {
    it.each([
      { input: '#ffffff', expected: '#000000' }, // white -> dark text
      { input: '#000000', expected: '#ffffff' }, // black -> light text
      { input: '#808080', expected: '#ffffff' }, // gray (lum ~0.22) -> light text
      { input: '#ffff00', expected: '#000000' }, // yellow (high lum) -> dark text
    ])('should return $expected for $input', ({ input, expected }) => {
      expect(readableColor(input, { method: 'wcag' })).toBe(expected);
    });

    it('should respect custom threshold', () => {
      // With low threshold, more colors will get dark text
      expect(readableColor('#333333', { method: 'wcag', threshold: 0.02 })).toBe('#000000');
    });

    it('should throw with invalid threshold', () => {
      expect(() => readableColor('#fff', { method: 'wcag', threshold: 1.5 })).toThrow(
        MESSAGES.thresholdNormalized,
      );
      expect(() => readableColor('#fff', { method: 'wcag', threshold: -0.1 })).toThrow(
        MESSAGES.thresholdNormalized,
      );
    });
  });

  describe('method: contrast', () => {
    it.each([
      { input: '#ffffff', expected: '#000000' }, // white -> dark text (higher contrast)
      { input: '#000000', expected: '#ffffff' }, // black -> light text (higher contrast)
      { input: '#808080', expected: '#000000' }, // gray -> dark text (slightly higher contrast)
      { input: '#ff0000', expected: '#000000' }, // red -> dark text (higher contrast ratio)
    ])('should return $expected for $input', ({ input, expected }) => {
      expect(readableColor(input, { method: 'contrast' })).toBe(expected);
    });

    it('should use custom colors', () => {
      expect(
        readableColor('#555', { method: 'contrast', darkColor: '#111', lightColor: '#eee' }),
      ).toBe('#eee');
    });
  });

  describe('method: oklab', () => {
    it.each([
      { input: '#ffffff', expected: '#000000' }, // white (L=1) -> dark text
      { input: '#000000', expected: '#ffffff' }, // black (L=0) -> light text
      { input: '#808080', expected: '#000000' }, // gray (L~0.6) -> dark text
    ])('should return $expected for $input', ({ input, expected }) => {
      expect(readableColor(input, { method: 'oklab' })).toBe(expected);
    });

    it('should respect custom threshold', () => {
      // Gray has L ~0.6, so with threshold 0.7, it should return light text
      expect(readableColor('#808080', { method: 'oklab', threshold: 0.7 })).toBe('#ffffff');
    });

    it('should throw with invalid threshold', () => {
      expect(() => readableColor('#fff', { method: 'oklab', threshold: 2 })).toThrow(
        MESSAGES.thresholdNormalized,
      );
    });
  });

  describe('method: apca', () => {
    it.each([
      { input: '#ffffff', expected: '#000000' }, // white -> dark text (higher Lc)
      { input: '#000000', expected: '#ffffff' }, // black -> light text (higher Lc)
      { input: '#888888', expected: '#ffffff' }, // gray -> light text (APCA favors light text on mid-grays)
    ])('should return $expected for $input', ({ input, expected }) => {
      expect(readableColor(input, { method: 'apca' })).toBe(expected);
    });

    it('should use custom colors', () => {
      expect(readableColor('#fff', { method: 'apca', darkColor: '#222', lightColor: '#ddd' })).toBe(
        '#222',
      );
    });
  });

  describe('error handling', () => {
    it('should throw with invalid string', () => {
      expect(() => readableColor('abcdef')).toThrow('invalid CSS string');
    });

    it('should fail with invalid parameters', () => {
      // @ts-expect-error - invalid parameters
      expect(() => readableColor([])).toThrow(MESSAGES.inputString);
    });
  });

  describe('CSS color formats', () => {
    it('should handle various CSS color formats', () => {
      expect(readableColor('rgb(255, 255, 255)')).toBe('#000000');
      expect(readableColor('hsl(0, 0%, 100%)')).toBe('#000000');
      expect(readableColor('white')).toBe('#000000');
      expect(readableColor('oklch(1 0 0)')).toBe('#000000');
    });
  });
});
