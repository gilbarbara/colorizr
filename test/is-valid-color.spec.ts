import isValidColor from '~/is-valid-color';
import { isHSL, isLAB, isLCH, isRGB } from '~/modules/validators';

import { ColorTypeInput } from '~/types';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('isValidColor', () => {
  it.each([
    { input: brightPink.hex, expected: true },
    { input: addOpacityToCssString(brightPink.hex, 0.5), expected: true },
    { input: green.hslString, expected: true },
    { input: addOpacityToCssString(green.hslString, 0.9), expected: true },
    { input: addOpacityToCssString(green.hslString, 0.9, true), expected: true },
    { input: orange.oklabString, expected: true },
    { input: addOpacityToCssString(orange.oklabString, 0.8, true), expected: true },
    { input: violet.oklchString, expected: true },
    { input: addOpacityToCssString(violet.oklchString, 0.9, true), expected: true },
    { input: 'oklch(75% 49% 180)', expected: true },
    { input: 'oklab(50% 25% -30%)', expected: true },
    // Angle units for HSL
    { input: 'hsl(120deg 100% 50%)', expected: true },
    { input: 'hsl(0.5turn 100% 50%)', expected: true },
    { input: 'hsl(3.14rad 100% 50%)', expected: true },
    { input: 'hsl(200grad 100% 50%)', expected: true },
    // Angle units for OkLCH
    { input: 'oklch(0.5 0.2 180deg)', expected: true },
    { input: 'oklch(0.5 0.2 0.5turn)', expected: true },
    // none keyword (CSS Color Level 4)
    { input: 'rgb(none 128 255)', expected: true },
    { input: 'hsl(none 50% 50%)', expected: true },
    { input: 'oklab(none 0.1 -0.1)', expected: true },
    { input: 'oklch(0.5 none 180)', expected: true },
    { input: yellow.rgbString, expected: true },
    { input: addOpacityToCssString(yellow.rgbString, 0.9), expected: true },
    { input: addOpacityToCssString(yellow.rgbString, 0.9, true), expected: true },
    { input: 'blue', expected: true },
    { input: 'aliceblue', expected: true },
    { input: 'transparent', expected: true },
    { input: 'Transparent', expected: true },
    { input: '#mmff00', expected: false },
    { input: '#1234567', expected: false },
    { input: 'blue-ish', expected: false },
    // Surrounding CSS whitespace is allowed; any other surrounding text is not
    { input: '  rgb(1 2 3)  ', expected: true },
    { input: ' #ff0000', expected: true },
    { input: '\tred\n', expected: true },
    { input: '\r\n hsl(0 50% 50%) \f', expected: true },
    { input: '\u00a0red', expected: false },
    { input: 'foo rgb(1 2 3) bar', expected: false },
    { input: 'notrgb(1 2 3)', expected: false },
    { input: 'background: hsl(0 50% 50%)', expected: false },
    { input: 'rgb(1 2 3) rgb(4 5 6)', expected: false },
    { input: 'rgb(1 2 3);', expected: false },
    { input: '#ff0000;', expected: false },
    { input: 'red;', expected: false },
  ])('should validate $input to be $expected', ({ input, expected }) => {
    expect(isValidColor(input)).toBe(expected);
  });

  describe('separators and function names', () => {
    it.each([
      // Modern syntax: whitespace between channels, '/' before alpha
      { input: 'rgb(255 0 0 / 0.5)', expected: true },
      { input: 'rgba(255 0 0 / 0.5)', expected: true },
      { input: 'hsla(120 50% 50%)', expected: true },
      { input: 'rgb(255\t0\n0)', expected: true },
      { input: 'rgb(255 0% 0)', expected: true },
      { input: 'hsl(120 50 50)', expected: true },
      { input: 'oklch(0.5 0.1 30/0.5)', expected: true },
      // Legacy syntax: commas, rgb/hsl only
      { input: 'rgb(255, 0, 0)', expected: true },
      { input: 'rgb(255,0,0,0.5)', expected: true },
      { input: 'rgba(255, 0, 0, 50%)', expected: true },
      { input: 'rgb(100%, 0%, 0%)', expected: true },
      { input: 'hsl(120, 50%, 50%)', expected: true },
      { input: 'hsla(120deg, 50%, 50%, 0.5)', expected: true },
      // Mixed separators
      { input: 'rgb(255, 0 0)', expected: false },
      { input: 'rgb(255 0 0, 0.5)', expected: false },
      { input: 'rgb(255, 0, 0 / 0.5)', expected: false },
      { input: 'rgb(255 / 0 / 0)', expected: false },
      // Commas in oklab/oklch
      { input: 'oklch(0.5, 0.1, 30)', expected: false },
      { input: 'oklab(0.5, 0.1, 0.1)', expected: false },
      // Legacy syntax rules
      { input: 'rgb(none, 0, 0)', expected: false },
      { input: 'rgb(255, 0, 0, none)', expected: false },
      { input: 'rgb(255, 0%, 0)', expected: false },
      { input: 'hsl(120, 50, 50)', expected: false },
      { input: 'hsl(120, 50%, 50)', expected: false },
      // Function names
      { input: 'oklcha(0.5 0.1 30)', expected: false },
      { input: 'oklaba(0.5 0.1 0.1)', expected: false },
      { input: 'rgb (255 0 0)', expected: false },
      // Separators are CSS whitespace only
      { input: 'rgb(255 0 0)', expected: false },
      { input: 'rgb(255 0 0)', expected: false },
    ])('should validate $input to be $expected', ({ input, expected }) => {
      expect(isValidColor(input)).toBe(expected);
    });
  });

  describe('value ranges', () => {
    it.each([
      // In range as written
      { input: 'rgb(255 0 0)', expected: true },
      { input: 'rgb(100% 0% 0%)', expected: true },
      { input: 'hsl(360 100% 50%)', expected: true },
      { input: 'oklch(1 0 0)', expected: true },
      { input: 'oklch(100% 0 0)', expected: true },
      { input: 'oklch(0.7 0.5 30)', expected: true },
      { input: 'oklab(0.7 0.5 -0.6)', expected: true },
      { input: 'rgb(1 2 3 / 0%)', expected: true },
      { input: 'rgb(1 2 3 / 50%)', expected: true },
      { input: 'rgb(1 2 3 / 1)', expected: true },
      { input: '#f00', expected: true },
      { input: 'red', expected: true },
      // Out of range as written
      { input: 'rgb(256 0 0)', expected: false },
      { input: 'rgb(300 0 0)', expected: false },
      { input: 'rgb(-10 0 0)', expected: false },
      { input: 'rgb(200% 0 0)', expected: false },
      { input: 'hsl(400 50% 50%)', expected: false },
      { input: 'hsl(-30 50% 50%)', expected: false },
      { input: 'hsl(360.000001 50% 50%)', expected: false },
      { input: 'hsl(-0.000001 50% 50%)', expected: false },
      { input: 'hsl(0 150% 50%)', expected: false },
      { input: 'hsl(0 50% -10%)', expected: false },
      { input: 'oklch(1.5 0 0)', expected: false },
      { input: 'oklch(150% 0 0)', expected: false },
      { input: 'oklch(-0.01 0 0)', expected: false },
      { input: 'oklch(0.7 -0.1 30)', expected: false },
      { input: 'oklch(0.5 0.1 400)', expected: false },
      { input: 'oklab(1.5 0 0)', expected: false },
      { input: 'rgb(1 2 3 / 2)', expected: false },
      { input: 'rgb(1 2 3 / 150%)', expected: false },
      { input: 'rgb(1 2 3 / -10%)', expected: false },
    ])('should validate $input to be $expected', ({ input, expected }) => {
      expect(isValidColor(input)).toBe(expected);
    });

    it('should apply the range check with a type', () => {
      expect(isValidColor('rgb(255 0 0)', 'rgb')).toBe(true);
      expect(isValidColor('rgb(300 0 0)', 'rgb')).toBe(false);
    });

    it.each([
      { input: 'rgb(300 0 0)', object: { r: 300, g: 0, b: 0 }, guard: isRGB },
      { input: 'rgb(255 0 0 / 0.5)', object: { r: 255, g: 0, b: 0, alpha: 0.5 }, guard: isRGB },
      { input: 'hsl(400 50% 50%)', object: { h: 400, s: 50, l: 50 }, guard: isHSL },
      { input: 'hsl(120 50% 50%)', object: { h: 120, s: 50, l: 50 }, guard: isHSL },
      { input: 'oklab(1.5 0 0)', object: { l: 1.5, a: 0, b: 0 }, guard: isLAB },
      { input: 'oklab(0.7 0.5 -0.6)', object: { l: 0.7, a: 0.5, b: -0.6 }, guard: isLAB },
      { input: 'oklch(0.7 -0.1 30)', object: { l: 0.7, c: -0.1, h: 30 }, guard: isLCH },
      { input: 'oklch(0.7 0.5 30)', object: { l: 0.7, c: 0.5, h: 30 }, guard: isLCH },
    ])('should match the type guard for $input', ({ input, object, guard }) => {
      expect(isValidColor(input)).toBe(guard(object));
    });
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(isValidColor()).toBe(false);
    // @ts-expect-error - invalid parameters
    expect(isValidColor([])).toBe(false);
    // @ts-expect-error - invalid parameters
    expect(isValidColor({})).toBe(false);
  });

  describe('with type parameter', () => {
    it.each([
      // hex validation
      { input: '#ff0000', type: 'hex', expected: true },
      { input: '#ff000080', type: 'hex', expected: true },
      { input: '#ff0000', type: 'hsl', expected: false },
      { input: '#ff0000', type: 'rgb', expected: false },
      // hsl validation
      { input: 'hsl(0 100% 50%)', type: 'hsl', expected: true },
      { input: 'hsl(0 100% 50%)', type: 'hex', expected: false },
      { input: 'hsl(0 100% 50%)', type: 'rgb', expected: false },
      // rgb validation
      { input: 'rgb(255 0 0)', type: 'rgb', expected: true },
      { input: 'rgb(255 0 0)', type: 'hex', expected: false },
      { input: 'rgb(255 0 0)', type: 'hsl', expected: false },
      // oklab validation
      { input: 'oklab(0.5 0.1 -0.1)', type: 'oklab', expected: true },
      { input: 'oklab(0.5 0.1 -0.1)', type: 'oklch', expected: false },
      // oklch validation
      { input: 'oklch(0.5 0.2 180)', type: 'oklch', expected: true },
      { input: 'oklch(0.5 0.2 180)', type: 'oklab', expected: false },
      // named color validation
      { input: 'blue', type: 'named', expected: true },
      { input: 'coral', type: 'named', expected: true },
      { input: 'blue', type: 'hex', expected: false },
      { input: 'blue', type: 'hsl', expected: false },
    ])('should validate $input as $type to be $expected', ({ input, type, expected }) => {
      expect(isValidColor(input, type as ColorTypeInput)).toBe(expected);
    });
  });
});
