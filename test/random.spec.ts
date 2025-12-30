import parseCSS from '~/parse-css';
import random from '~/random';

import { ColorType } from '~/types';

describe('random', () => {
  it.each(['hex', 'hsl', 'oklab', 'oklch', 'rgb'] as Array<ColorType>)(
    'should return a valid %s color',
    type => {
      const color = random({ format: type });

      expect(color).toBeDefined();
    },
  );

  describe('with HSL constraints', () => {
    it('should respect fixed saturation (min === max)', () => {
      const color = random({ format: 'hsl', minSaturation: 50, maxSaturation: 50 });
      const parsed = parseCSS(color, 'hsl');

      expect(parsed.s).toBe(50);
    });

    it('should respect fixed lightness (min === max)', () => {
      const color = random({ format: 'hsl', minLightness: 75, maxLightness: 75 });
      const parsed = parseCSS(color, 'hsl');

      expect(parsed.l).toBe(75);
    });

    it('should respect saturation range', () => {
      for (let index = 0; index < 20; index++) {
        const color = random({ format: 'hsl', minSaturation: 60, maxSaturation: 80 });
        const parsed = parseCSS(color, 'hsl');

        expect(parsed.s).toBeGreaterThanOrEqual(60);
        expect(parsed.s).toBeLessThanOrEqual(80);
      }
    });

    it('should respect lightness range', () => {
      for (let index = 0; index < 20; index++) {
        const color = random({ format: 'hsl', minLightness: 20, maxLightness: 40 });
        const parsed = parseCSS(color, 'hsl');

        expect(parsed.l).toBeGreaterThanOrEqual(20);
        expect(parsed.l).toBeLessThanOrEqual(40);
      }
    });

    it('should respect hue range (normal case)', () => {
      for (let index = 0; index < 20; index++) {
        const color = random({ format: 'hsl', minHue: 60, maxHue: 120 });
        const parsed = parseCSS(color, 'hsl');

        expect(parsed.h).toBeGreaterThanOrEqual(60);
        expect(parsed.h).toBeLessThanOrEqual(120);
      }
    });

    it('should respect hue range with wrap-around', () => {
      for (let index = 0; index < 20; index++) {
        const color = random({ format: 'hsl', minHue: 330, maxHue: 30 });
        const parsed = parseCSS(color, 'hsl');

        // Hue should be either >= 330 OR <= 30 (wraps around 0)
        expect(parsed.h >= 330 || parsed.h <= 30).toBe(true);
      }
    });
  });
});
