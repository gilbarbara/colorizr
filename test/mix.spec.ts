import mix from '~/mix';
import { MESSAGES } from '~/modules/constants';

describe('mix', () => {
  describe('basic mixing', () => {
    it('should mix colors at 50% by default', () => {
      expect(mix('#ff0000', '#0000ff')).toBe('#ba00c2');
    });

    it('should return first color at ratio 0', () => {
      expect(mix('#ff0000', '#0000ff', 0)).toBe('#ff0000');
    });

    it('should return second color at ratio 1', () => {
      expect(mix('#ff0000', '#0000ff', 1)).toBe('#0000ff');
    });

    it('should mix black and white to gray', () => {
      expect(mix('#000000', '#ffffff', 0.5)).toBe('#636363');
    });
  });

  describe('hue interpolation', () => {
    it('should take shortest path (red to blue through magenta)', () => {
      // Red (h≈30°) to Blue (h≈265°) should go through magenta, not green
      expect(mix('#ff0000', '#0000ff', 0.5)).toBe('#ba00c2');
    });

    it('should handle achromatic first color', () => {
      // Gray + Blue should use blue's hue
      expect(mix('#808080', '#0000ff', 0.5)).toBe('#3b64c4');
    });

    it('should handle achromatic second color', () => {
      // Red + Gray should use red's hue
      expect(mix('#ff0000', '#808080', 0.5)).toBe('#c66356');
    });

    it('should handle two achromatic colors', () => {
      // Black + White = Gray
      expect(mix('#000000', '#ffffff', 0.5)).toBe('#636363');
    });

    it('should handle hue crossing 0° and normalize result >= 360', () => {
      // h1 ≈ 354.75°, h2 ≈ 35.22° → diff = -319.53 < -180, adjusted to +40.47
      // result = 354.75 + 40.47 * 0.5 = 375 >= 360, normalized to 15
      expect(mix('#ff0099', '#ff4400', 0.5)).toBe('#ff225e');
    });

    it('should take shortest path when diff > 180', () => {
      // h1 ≈ 29°, h2 ≈ 260° → diff = 231 > 180, adjusted to -129
      // Goes through magenta instead of green
      expect(mix('#ff0000', '#0066ff', 0.5)).toBe('#c32cce');
    });
  });

  describe('alpha handling', () => {
    it('should interpolate alpha values', () => {
      expect(mix('rgba(255, 0, 0, 0)', 'rgba(0, 0, 255, 1)', 0.5)).toBe('rgb(186 0 194 / 50%)');
    });

    it('should preserve alpha from hex', () => {
      expect(mix('#ff000000', '#0000ffff', 0.5)).toBe('#ba00c280');
    });
  });

  describe('format preservation', () => {
    it('should preserve format of first color', () => {
      expect(mix('hsl(0, 100%, 50%)', '#0000ff', 0.5)).toBe('hsl(297.53 100% 38.04%)');
      expect(mix('rgb(255, 0, 0)', '#0000ff', 0.5)).toBe('rgb(186 0 194)');
      expect(mix('oklch(50% 0.2 30)', '#0000ff', 0.5)).toBe('oklch(47.601% 0.25661 327.02576)');
    });

    it('should allow format override', () => {
      expect(mix('#ff0000', '#0000ff', 0.5, 'hsl')).toBe('hsl(297.53 100% 38.04%)');
      expect(mix('#ff0000', '#0000ff', 0.5, 'oklch')).toBe('oklch(53.998% 0.28545 326.64323)');
    });
  });

  describe('validation', () => {
    it('should fail with invalid first color', () => {
      expect(() => mix('', '#fff')).toThrow(MESSAGES.inputString);
      // @ts-expect-error - invalid parameters
      expect(() => mix(123, '#fff')).toThrow(MESSAGES.inputString);
    });

    it('should fail with invalid second color', () => {
      expect(() => mix('#fff', '')).toThrow(MESSAGES.inputString);
      // @ts-expect-error - invalid parameters
      expect(() => mix('#fff', null)).toThrow(MESSAGES.inputString);
    });

    it('should fail with invalid ratio', () => {
      expect(() => mix('#fff', '#000', 2)).toThrow('ratio must be a number between 0 and 1');
      expect(() => mix('#fff', '#000', -1)).toThrow('ratio must be a number between 0 and 1');
      // @ts-expect-error - invalid parameters
      expect(() => mix('#fff', '#000', 'half')).toThrow('ratio must be a number between 0 and 1');
    });
  });
});
