import getColorType from '~/get-color-type';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('getColorType', () => {
  describe('hex', () => {
    it.each([
      [brightPink.hex, 'hex'],
      [green.hex, 'hex'],
      ['#fff', 'hex'],
      ['#ffffff', 'hex'],
      ['#ff000080', 'hex'],
      ['#f0f8', 'hex'],
    ])('should detect %s as %s', (input, expected) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('hsl', () => {
    it.each([
      [brightPink.hslString, 'hsl'],
      [green.hslString, 'hsl'],
      ['hsl(0 100% 50%)', 'hsl'],
      ['hsl(120deg 100% 50%)', 'hsl'],
      ['hsl(0.5turn 100% 50%)', 'hsl'],
      ['hsla(0 100% 50% / 0.5)', 'hsl'],
    ])('should detect %s as %s', (input, expected) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('rgb', () => {
    it.each([
      [yellow.rgbString, 'rgb'],
      [orange.rgbString, 'rgb'],
      ['rgb(255 0 0)', 'rgb'],
      ['rgb(255, 0, 0)', 'rgb'],
      ['rgba(255 0 0 / 0.5)', 'rgb'],
    ])('should detect %s as %s', (input, expected) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('oklab', () => {
    it.each([
      [orange.oklabString, 'oklab'],
      [violet.oklabString, 'oklab'],
      ['oklab(0.5 0.1 -0.1)', 'oklab'],
      ['oklab(50% 25% -30%)', 'oklab'],
    ])('should detect %s as %s', (input, expected) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('oklch', () => {
    it.each([
      [violet.oklchString, 'oklch'],
      [brightPink.oklchString, 'oklch'],
      ['oklch(0.5 0.2 180)', 'oklch'],
      ['oklch(50% 0.2 180deg)', 'oklch'],
      ['oklch(0.5 0.2 0.5turn)', 'oklch'],
    ])('should detect %s as %s', (input, expected) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('named', () => {
    it.each([
      ['blue', 'named'],
      ['coral', 'named'],
      ['aliceblue', 'named'],
      ['RED', 'named'],
      ['DarkSlateGray', 'named'],
    ])('should detect %s as %s', (input, expected) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('invalid inputs', () => {
    it.each([
      ['invalid', null],
      ['', null],
      ['#gggggg', null],
      ['rgb()', null],
      ['blue-ish', null],
    ])('should return null for %s', (input, expected) => {
      expect(getColorType(input)).toBe(expected);
    });

    it('should return null for non-string inputs', () => {
      // @ts-expect-error - testing invalid input
      expect(getColorType()).toBe(null);
      // @ts-expect-error - testing invalid input
      expect(getColorType(null)).toBe(null);
      // @ts-expect-error - testing invalid input
      expect(getColorType(123)).toBe(null);
      // @ts-expect-error - testing invalid input
      expect(getColorType({})).toBe(null);
    });
  });
});
