import getColorType from '~/get-color-type';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('getColorType', () => {
  describe('hex', () => {
    it.each([
      { input: brightPink.hex, expected: 'hex' },
      { input: green.hex, expected: 'hex' },
      { input: '#fff', expected: 'hex' },
      { input: '#ffffff', expected: 'hex' },
      { input: '#ff000080', expected: 'hex' },
      { input: '#f0f8', expected: 'hex' },
    ])('should detect $input as $expected', ({ input, expected }) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('hsl', () => {
    it.each([
      { input: brightPink.hslString, expected: 'hsl' },
      { input: green.hslString, expected: 'hsl' },
      { input: 'hsl(0 100% 50%)', expected: 'hsl' },
      { input: 'hsl(120deg 100% 50%)', expected: 'hsl' },
      { input: 'hsl(0.5turn 100% 50%)', expected: 'hsl' },
      { input: 'hsla(0 100% 50% / 0.5)', expected: 'hsl' },
    ])('should detect $input as $expected', ({ input, expected }) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('rgb', () => {
    it.each([
      { input: yellow.rgbString, expected: 'rgb' },
      { input: orange.rgbString, expected: 'rgb' },
      { input: 'rgb(255 0 0)', expected: 'rgb' },
      { input: 'rgb(255, 0, 0)', expected: 'rgb' },
      { input: 'rgba(255 0 0 / 0.5)', expected: 'rgb' },
    ])('should detect $input as $expected', ({ input, expected }) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('oklab', () => {
    it.each([
      { input: orange.oklabString, expected: 'oklab' },
      { input: violet.oklabString, expected: 'oklab' },
      { input: 'oklab(0.5 0.1 -0.1)', expected: 'oklab' },
      { input: 'oklab(50% 25% -30%)', expected: 'oklab' },
    ])('should detect $input as $expected', ({ input, expected }) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('oklch', () => {
    it.each([
      { input: violet.oklchString, expected: 'oklch' },
      { input: brightPink.oklchString, expected: 'oklch' },
      { input: 'oklch(0.5 0.2 180)', expected: 'oklch' },
      { input: 'oklch(50% 0.2 180deg)', expected: 'oklch' },
      { input: 'oklch(0.5 0.2 0.5turn)', expected: 'oklch' },
    ])('should detect $input as $expected', ({ input, expected }) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('named', () => {
    it.each([
      { input: 'blue', expected: 'named' },
      { input: 'coral', expected: 'named' },
      { input: 'aliceblue', expected: 'named' },
      { input: 'RED', expected: 'named' },
      { input: 'DarkSlateGray', expected: 'named' },
    ])('should detect $input as $expected', ({ input, expected }) => {
      expect(getColorType(input)).toBe(expected);
    });
  });

  describe('invalid inputs', () => {
    it.each([
      { input: 'invalid', expected: null },
      { input: '', expected: null },
      { input: '#gggggg', expected: null },
      { input: 'rgb()', expected: null },
      { input: 'blue-ish', expected: null },
    ])('should return null for $input', ({ input, expected }) => {
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
