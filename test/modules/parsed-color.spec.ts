import formatCSS from '~/format-css';
import { isParsedColor, resolveColor } from '~/modules/parsed-color';

import { brightPink, green, orange, violet, yellow } from 'test/__fixtures__';

describe('parsed-color', () => {
  describe('isParsedColor', () => {
    it('should return true for ParsedColor objects', () => {
      const parsed = resolveColor(brightPink.hex);

      expect(isParsedColor(parsed)).toBe(true);
    });

    it('should return false for strings', () => {
      expect(isParsedColor('#ff0044')).toBe(false);
    });

    it('should return false for plain objects', () => {
      expect(isParsedColor({ h: 0, s: 0, l: 0 })).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isParsedColor(null)).toBe(false);
      expect(isParsedColor(undefined)).toBe(false);
    });
  });

  describe('resolveColor', () => {
    describe('passthrough', () => {
      it('should return the same reference for already-parsed input', () => {
        const parsed = resolveColor(brightPink.hex);
        const resolved = resolveColor(parsed);

        expect(resolved).toBe(parsed);
      });
    });

    describe('hex input', () => {
      it.each([
        ['brightPink', brightPink],
        ['green', green],
        ['orange', orange],
        ['violet', violet],
        ['yellow', yellow],
      ])('%s: should parse hex and convert lazily', (_name, fixture) => {
        const parsed = resolveColor(fixture.hex);

        expect(parsed.type).toBe('hex');
        expect(parsed.alpha).toBe(1);
        expect(parsed.hex).toBe(fixture.hex);
        expect(parsed.hsl).toEqual(fixture.hsl);
        expect(parsed.rgb).toEqual(fixture.rgb);
        // oklab/oklch: raw converter output has full precision (no rounding)
        expect(parsed.oklab).toEqual(fixture.oklabLong);
        expect(parsed.oklch).toEqual(fixture.oklchLong);
      });

      it('should handle hex with alpha', () => {
        const parsed = resolveColor(brightPink.hexAlpha);

        expect(parsed.type).toBe('hex');
        expect(parsed.alpha).toBeCloseTo(0.5, 1);
        expect(parsed.hex).toBe(brightPink.hex);
      });
    });

    describe('named color input', () => {
      it('should resolve named colors', () => {
        const parsed = resolveColor('red');

        expect(parsed.type).toBe('hex');
        expect(parsed.hex).toBe('#ff0000');
      });

      it('should be case-insensitive', () => {
        const parsed = resolveColor('Red');

        expect(parsed.type).toBe('hex');
        expect(parsed.hex).toBe('#ff0000');
      });
    });

    describe('HSL string input', () => {
      it.each([
        ['brightPink', brightPink],
        ['green', green],
        ['orange', orange],
        ['violet', violet],
        ['yellow', yellow],
      ])('%s: should parse HSL string and convert lazily', (_name, fixture) => {
        const parsed = resolveColor(fixture.hslString);

        expect(parsed.type).toBe('hsl');
        expect(parsed.alpha).toBe(1);
        expect(parsed.hsl).toEqual(fixture.hsl);
        expect(parsed.hex).toBe(fixture.hex);
        expect(parsed.rgb).toEqual(fixture.rgb);
      });
    });

    describe('RGB string input', () => {
      it.each([
        ['brightPink', brightPink],
        ['green', green],
        ['orange', orange],
        ['violet', violet],
        ['yellow', yellow],
      ])('%s: should parse RGB string and convert lazily', (_name, fixture) => {
        const parsed = resolveColor(fixture.rgbString);

        expect(parsed.type).toBe('rgb');
        expect(parsed.alpha).toBe(1);
        expect(parsed.rgb).toEqual(fixture.rgb);
        expect(parsed.hex).toBe(fixture.hex);
      });
    });

    describe('OkLab string input', () => {
      it.each([
        ['brightPink', brightPink],
        ['green', green],
      ])('%s: should parse OkLab string and convert lazily', (_name, fixture) => {
        const parsed = resolveColor(fixture.oklabString);

        expect(parsed.type).toBe('oklab');
        expect(parsed.alpha).toBe(1);
        expect(parsed.oklab).toEqual(fixture.oklab);
      });
    });

    describe('OkLCH string input', () => {
      it.each([
        ['brightPink', brightPink],
        ['green', green],
      ])('%s: should parse OkLCH string and convert lazily', (_name, fixture) => {
        const parsed = resolveColor(fixture.oklchString);

        expect(parsed.type).toBe('oklch');
        expect(parsed.alpha).toBe(1);
        // oklchString has truncated hue, so compare l and c exactly, h approximately
        expect(parsed.oklch.l).toBe(fixture.oklch.l);
        expect(parsed.oklch.c).toBe(fixture.oklch.c);
        expect(parsed.oklch.h).toBeCloseTo(fixture.oklch.h, 2);
      });
    });

    describe('object input', () => {
      it('should handle HSL objects', () => {
        const parsed = resolveColor(green.hsl);

        expect(parsed.type).toBe('hsl');
        expect(parsed.alpha).toBe(1);
        expect(parsed.hsl).toEqual(green.hsl);
        expect(parsed.hex).toBe(green.hex);
      });

      it('should handle RGB objects', () => {
        const parsed = resolveColor(yellow.rgb);

        expect(parsed.type).toBe('rgb');
        expect(parsed.rgb).toEqual(yellow.rgb);
        expect(parsed.hex).toBe(yellow.hex);
      });

      it('should handle OkLab objects', () => {
        const parsed = resolveColor(orange.oklab);

        expect(parsed.type).toBe('oklab');
        expect(parsed.oklab).toEqual(orange.oklab);
      });

      it('should handle OkLCH objects', () => {
        const parsed = resolveColor(violet.oklch);

        expect(parsed.type).toBe('oklch');
        expect(parsed.oklch).toEqual(violet.oklch);
      });

      it('should preserve alpha from object input', () => {
        const parsed = resolveColor({ ...green.hsl, alpha: 0.5 });

        expect(parsed.alpha).toBe(0.5);
        expect(parsed.type).toBe('hsl');
        expect(parsed.hsl).toEqual(green.hsl);
      });
    });

    describe('cache consistency', () => {
      it('should return the same object on repeated access', () => {
        const parsed = resolveColor(brightPink.hex);
        const hsl1 = parsed.hsl;
        const hsl2 = parsed.hsl;

        expect(hsl1).toBe(hsl2);
      });
    });
  });

  describe('toCSS', () => {
    it('should output hex by default for hex input', () => {
      const parsed = resolveColor(brightPink.hex);

      expect(parsed.toCSS()).toBe(brightPink.hex);
    });

    it('should output in the original format by default', () => {
      const parsed = resolveColor(brightPink.hslString);

      expect(parsed.toCSS()).toBe(brightPink.hslString);
    });

    it('should output in a specified format', () => {
      const parsed = resolveColor(brightPink.hex);

      expect(parsed.toCSS({ format: 'hsl' })).toBe(brightPink.hslString);
    });

    it('should match formatCSS output for non-hex formats', () => {
      const parsed = resolveColor(brightPink.hex);
      const fromFormatCSS = formatCSS(brightPink.rgb, { format: 'rgb' });

      expect(parsed.toCSS({ format: 'rgb' })).toBe(fromFormatCSS);
    });

    it('should include alpha in hex output', () => {
      const parsed = resolveColor(brightPink.hexAlpha);

      expect(parsed.toCSS()).toBe(brightPink.hexAlpha);
    });

    it('should include alpha in non-hex output', () => {
      const parsed = resolveColor(brightPink.hexAlpha);
      const result = parsed.toCSS({ format: 'rgb' });

      expect(result).toContain('/ 50%');
    });
  });
});
