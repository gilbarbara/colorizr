import isValidColor from '~/is-valid-color';

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
    { input: '#mmff00', expected: false },
    { input: 'blue-ish', expected: false },
  ])('should validate $input to be $expected', ({ input, expected }) => {
    expect(isValidColor(input)).toBe(expected);
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
