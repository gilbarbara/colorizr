import { MESSAGES } from '~/modules/constants';
import scale, { type ScaleOptions } from '~/scale';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('scale', () => {
  describe('basic functionality', () => {
    it.each<[string, ScaleOptions | undefined]>([
      [brightPink.hex, undefined],
      [brightPink.hex, { maxLightness: 0.9 }],
      [brightPink.hex, { minLightness: 0.1 }],
      [brightPink.hex, { format: 'oklch' }],
      [green.hslString, undefined],
      [green.hslString, { variant: 'deep' }],
      [orange.oklabString, undefined],
      [orange.oklabString, { lightnessCurve: 1.2 }],
      [orange.oklabString, { variant: 'neutral' }],
      [violet.oklchString, undefined],
      [violet.oklchString, { variant: 'pastel' }],
      [yellow.rgbString, undefined],
      [yellow.rgbString, { variant: 'subtle' }],
      ['oklch(0.65 0.3 27.34)', undefined],
      ['#d4ffc7', { variant: 'vibrant' }],
      ['#808080', undefined],
      ['lightblue', undefined],
    ])('should return properly with %s and %s', (input, options) => {
      expect(scale(input, options)).toMatchSnapshot();
    });

    it('should fail with invalid parameters', () => {
      // @ts-expect-error - invalid parameters
      expect(() => scale(undefined)).toThrow(MESSAGES.inputString);
    });
  });

  describe('steps option', () => {
    it.each([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])(
      'should generate correct keys for steps: %d',
      steps => {
        const result = scale(violet.hex, { steps });
        const keys = Object.keys(result).map(Number);

        expect(keys).toHaveLength(steps);
        expect(result).toMatchSnapshot();
      },
    );

    it('should clamp steps below minimum to 3', () => {
      const result = scale(violet.hex, { steps: 1 });
      const keys = Object.keys(result).map(Number);

      expect(keys).toHaveLength(3);
      expect(keys).toEqual([100, 500, 900]);
    });

    it('should clamp steps above maximum to 20', () => {
      const result = scale(violet.hex, { steps: 25 });
      const keys = Object.keys(result).map(Number);

      expect(keys).toHaveLength(20);
    });

    it('should round non-integer steps', () => {
      const result = scale(violet.hex, { steps: 7.5 });
      const keys = Object.keys(result).map(Number);

      expect(keys).toHaveLength(8);
    });
  });

  describe('mode option', () => {
    it('should generate light mode by default', () => {
      const result = scale(violet.hex);

      expect(result).toMatchSnapshot();
    });

    it('should generate dark mode with inverted lightness', () => {
      const result = scale(violet.hex, { mode: 'dark' });

      expect(result).toMatchSnapshot();
    });

    it('should have different lightness values in light vs dark mode', () => {
      const lightResult = scale(violet.hex, { mode: 'light', format: 'oklch' });
      const darkResult = scale(violet.hex, { mode: 'dark', format: 'oklch' });

      // In light mode, 50 should be lightest (highest l)
      // In dark mode, 50 should be darkest (lowest l)
      // Parse the oklch strings to compare
      const extractLightness = (color: string) => {
        const match = color.match(/oklch\(([\d.]+)%/);

        return match ? parseFloat(match[1]) : 0;
      };

      expect(extractLightness(lightResult[50])).toBeGreaterThan(extractLightness(lightResult[950]));
      expect(extractLightness(darkResult[50])).toBeLessThan(extractLightness(darkResult[950]));
    });
  });

  describe('chromaCurve option', () => {
    it('should maintain constant chroma with chromaCurve: 0 (default)', () => {
      const result = scale(violet.hex, { format: 'oklch' });

      expect(result).toMatchSnapshot();
    });

    it('should apply parabolic curve with chromaCurve: 1 (legacy)', () => {
      const result = scale(violet.hex, { chromaCurve: 1, format: 'oklch' });

      expect(result).toMatchSnapshot();
    });

    it('should interpolate with chromaCurve: 0.5', () => {
      const result = scale(violet.hex, { chromaCurve: 0.5, format: 'oklch' });

      expect(result).toMatchSnapshot();
    });

    it('should have different chroma values between chromaCurve 0 and 1', () => {
      const constantChroma = scale(violet.hex, { chromaCurve: 0, format: 'oklch' });
      const parabolicChroma = scale(violet.hex, { chromaCurve: 1, format: 'oklch' });

      // Extract chroma from oklch strings
      const extractChroma = (color: string) => {
        const match = color.match(/oklch\([\d.]+% ([\d.]+)/);

        return match ? parseFloat(match[1]) : 0;
      };

      // At extremes (50 and 950), parabolic should have lower chroma
      expect(extractChroma(constantChroma[50])).toBeGreaterThan(extractChroma(parabolicChroma[50]));
      expect(extractChroma(constantChroma[950])).toBeGreaterThan(
        extractChroma(parabolicChroma[950]),
      );
    });
  });

  describe('saturation option', () => {
    it('should generate grayscale with saturation: 0', () => {
      const result = scale(violet.hex, { saturation: 0, format: 'oklch' });

      expect(result).toMatchSnapshot();
      // All shades should have 0 chroma
      Object.values(result).forEach(color => {
        const match = color.match(/oklch\([\d.]+% ([\d.]+)/);
        const chroma = match ? parseFloat(match[1]) : 1;

        expect(chroma).toBe(0);
      });
    });

    it('should use max chroma with saturation: 100', () => {
      const result = scale(violet.hex, { saturation: 100, format: 'oklch' });

      expect(result).toMatchSnapshot();
    });

    it('should override variant when both are set', () => {
      const resultWithSaturation = scale(violet.hex, {
        saturation: 50,
        variant: 'vibrant',
        format: 'oklch',
      });
      const resultWithoutVariant = scale(violet.hex, { saturation: 50, format: 'oklch' });

      expect(resultWithSaturation).toEqual(resultWithoutVariant);
    });
  });

  describe('lock option', () => {
    it('should preserve exact input color at locked position', () => {
      const input = '#224e2e';
      const result = scale(input, { lock: 500 });

      expect(result[500]).toBe(input);
    });

    it('should lock input color at step 500', () => {
      const input = '#8B5CF6';
      const result = scale(input, { lock: 500, format: 'oklch' });

      expect(result).toMatchSnapshot();
    });

    it('should apply "chromaCurve" to locked position', () => {
      const input = '#224e2e';
      const result = scale(input, { lock: 500, chromaCurve: 0.5 });

      expect(result[500]).toMatchSnapshot();
    });

    it('should apply "saturation" to locked position', () => {
      const input = '#224e2e';
      const result = scale(input, { lock: 500, saturation: 20 });

      expect(result[500]).toMatchSnapshot();
    });

    it('should lock at first key (50)', () => {
      const input = '#8B5CF6';
      const result = scale(input, { lock: 50, format: 'oklch' });

      expect(result).toMatchSnapshot();
    });

    it('should lock at last key (950)', () => {
      const input = '#8B5CF6';
      const result = scale(input, { lock: 950, format: 'oklch' });

      expect(result).toMatchSnapshot();
    });

    it('should ignore invalid lock value and warn', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = scale(violet.hex, { lock: 999 });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('lock: 999 is not valid for steps: 11'),
      );
      expect(result).toMatchSnapshot();
      warnSpy.mockRestore();
    });

    it('should work with different step counts', () => {
      const result = scale(violet.hex, { steps: 5, lock: 500, format: 'oklch' });
      const keys = Object.keys(result).map(Number);

      expect(keys).toEqual([100, 300, 500, 700, 900]);
      expect(result).toMatchSnapshot();
    });
  });

  describe('option interactions', () => {
    it('should work with lock + mode: dark', () => {
      const result = scale(violet.hex, { lock: 500, mode: 'dark', format: 'oklch' });

      expect(result).toMatchSnapshot();
    });

    it('should work with lock + steps', () => {
      const result = scale(violet.hex, { lock: 500, steps: 5, format: 'oklch' });

      expect(result).toMatchSnapshot();
    });
  });

  describe('return types', () => {
    it('should return Scale type when no steps provided', () => {
      const result = scale(violet.hex);

      // TypeScript should allow accessing ColorTokens keys
      expect(result[50]).toBeDefined();
      expect(result[100]).toBeDefined();
      expect(result[950]).toBeDefined();
    });

    it('should return Record<number, string> when steps provided', () => {
      const result = scale(violet.hex, { steps: 5 });
      const keys = Object.keys(result).map(Number);

      expect(keys).toEqual([100, 300, 500, 700, 900]);
    });
  });
});
