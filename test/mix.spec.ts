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
      expect(mix('#ff0000', '#0000ff', 0.5)).toBe('#ba00c2');
    });

    it('should handle achromatic first color', () => {
      expect(mix('#808080', '#0000ff', 0.5)).toBe('#3b64c4');
    });

    it('should handle achromatic second color', () => {
      expect(mix('#ff0000', '#808080', 0.5)).toBe('#c66356');
    });

    it('should handle two achromatic colors', () => {
      expect(mix('#000000', '#ffffff', 0.5)).toBe('#636363');
    });

    it('should handle hue crossing 0° and normalize result >= 360', () => {
      expect(mix('#ff0099', '#ff4400', 0.5)).toBe('#ff225e');
    });

    it('should take shortest path when diff > 180', () => {
      expect(mix('#ff0000', '#0066ff', 0.5)).toBe('#c32cce');
    });
  });

  describe('hue modes', () => {
    // Red hue ~29°, Blue hue ~265° in OkLCH (diff ~236° > 180°)
    // shorter: wraps backward through magenta → midpoint hue ~327°
    // longer: goes forward through green → midpoint hue ~147°
    it('should use shorter mode by default', () => {
      expect(mix('#ff0000', '#0000ff', 0.5)).toBe(
        mix('#ff0000', '#0000ff', 0.5, { hue: 'shorter' }),
      );
    });

    it('should go through magenta with shorter (red to blue)', () => {
      // shorter wraps backward: midpoint hue ~327° (magenta)
      expect(mix('#ff0000', '#0000ff', 0.5, { hue: 'shorter' })).toBe('#ba00c2');
    });

    it('should go through green with longer (red to blue)', () => {
      // longer goes forward: midpoint hue ~147° (green)
      expect(mix('#ff0000', '#0000ff', 0.5, { hue: 'longer' })).toBe('#009300');
    });

    it('should always increase hue angle with increasing mode', () => {
      // Red ~29° to Blue ~265°: increasing goes forward 29→265, through green (~147°)
      expect(mix('#ff0000', '#0000ff', 0.5, { hue: 'increasing' })).toBe('#009300');
    });

    it('should always decrease hue angle with decreasing mode', () => {
      // Red ~29° to Blue ~265°: decreasing goes backward 29→-95→265, through magenta (~327°)
      expect(mix('#ff0000', '#0000ff', 0.5, { hue: 'decreasing' })).toBe('#ba00c2');
    });

    it('should produce different arcs for shorter vs longer (red to green)', () => {
      // Red ~29° to Green ~142° (diff ~113° < 180°)
      // shorter goes forward through yellow: ~86°
      expect(mix('#ff0000', '#00ff00', 0.5, { hue: 'shorter' })).toBe('#f99500');
      // longer wraps backward through blue/magenta: ~266°
      expect(mix('#ff0000', '#00ff00', 0.5, { hue: 'longer' })).toBe('#5999ff');
    });
  });

  describe('interpolation spaces', () => {
    it('should default to oklch', () => {
      const result = mix('#ff0000', '#0000ff', 0.5);
      const explicit = mix('#ff0000', '#0000ff', 0.5, { space: 'oklch' });

      expect(result).toBe(explicit);
    });

    it('should mix in rgb space', () => {
      // RGB mixing of red + blue = purple (128, 0, 128), no magenta shift
      expect(mix('#ff0000', '#0000ff', 0.5, { space: 'rgb' })).toBe('#800080');
    });

    it('should mix in hsl space', () => {
      const result = mix('#ff0000', '#0000ff', 0.5, { space: 'hsl' });

      expect(result).not.toBe(mix('#ff0000', '#0000ff', 0.5, { space: 'rgb' }));
    });

    it('should mix in oklab space', () => {
      const result = mix('#ff0000', '#0000ff', 0.5, { space: 'oklab' });

      // OkLab produces different results than OkLCH due to linear a/b interpolation
      expect(result).not.toBe(mix('#ff0000', '#0000ff', 0.5, { space: 'oklch' }));
    });

    it('should mix black and white correctly in all spaces', () => {
      const rgb = mix('#000000', '#ffffff', 0.5, { space: 'rgb' });
      const hsl = mix('#000000', '#ffffff', 0.5, { space: 'hsl' });
      const oklab = mix('#000000', '#ffffff', 0.5, { space: 'oklab' });

      // All should produce some shade of gray
      expect(rgb).toBe('#808080');
      expect(hsl).toMatch(/^#[\da-f]{6}$/);
      expect(oklab).toMatch(/^#[\da-f]{6}$/);
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
      expect(mix('oklch(50% 0.2 30)', '#0000ff', 0.5)).toBe('oklch(47.601% 0.25661 327.03)');
    });

    it('should allow format override', () => {
      expect(mix('#ff0000', '#0000ff', 0.5, { format: 'hsl' })).toBe('hsl(297.53 100% 38.04%)');
      expect(mix('#ff0000', '#0000ff', 0.5, { format: 'oklch' })).toBe(
        'oklch(53.998% 0.28545 326.64)',
      );
    });

    it('should accept format as string shorthand', () => {
      expect(mix('#ff0000', '#0000ff', 0.5, 'hsl')).toBe('hsl(297.53 100% 38.04%)');
      expect(mix('#ff0000', '#0000ff', 0.5, 'oklch')).toBe('oklch(53.998% 0.28545 326.64)');
    });
  });

  describe('combined options', () => {
    it('should support space + format together', () => {
      const result = mix('#ff0000', '#0000ff', 0.5, { space: 'rgb', format: 'hsl' });

      expect(result).toMatch(/^hsl\(/);
    });

    it('should support space + hue together', () => {
      const result = mix('#ff0000', '#0000ff', 0.5, { space: 'hsl', hue: 'longer' });

      expect(result).toMatch(/^#[\da-f]{6}$/);
    });

    it('should ignore hue mode for linear spaces', () => {
      const withHue = mix('#ff0000', '#0000ff', 0.5, { space: 'rgb', hue: 'longer' });
      const withoutHue = mix('#ff0000', '#0000ff', 0.5, { space: 'rgb' });

      expect(withHue).toBe(withoutHue);
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
