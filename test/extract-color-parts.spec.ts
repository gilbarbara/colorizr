import extractColorParts from '~/extract-color-parts';
import { MESSAGES } from '~/modules/constants';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('extractColorParts', () => {
  it.each([
    {
      input: brightPink.hex,
      expected: { model: 'rgb', ...brightPink.rgb },
    },
    {
      input: addOpacityToCssString(brightPink.hex, 0.9),
      expected: { model: 'rgb', ...brightPink.rgb, alpha: 0.9 },
    },
    {
      input: green.rgbString,
      expected: { model: 'rgb', ...green.rgb },
    },
    {
      input: addOpacityToCssString(green.rgbString, 0.4),
      expected: { model: 'rgb', ...green.rgb, alpha: 0.4 },
    },
    {
      input: orange.hslString,
      expected: { model: 'hsl', ...orange.hsl },
    },
    {
      input: violet.oklabString,
      expected: { model: 'oklab', ...violet.oklab, l: 47.642 },
    },
    {
      input: addOpacityToCssString(violet.oklabString, 0.85, true),
      expected: { model: 'oklab', ...violet.oklab, l: 47.642, alpha: 0.85 },
    },
    {
      input: yellow.oklchString,
      expected: { model: 'oklch', ...yellow.oklch, l: 92.235 },
    },
    {
      input: addOpacityToCssString(yellow.oklchString, 0.95, true),
      expected: { model: 'oklch', ...yellow.oklch, l: 92.235, alpha: 0.95 },
    },
    {
      input: 'oklab(0.63 0.24 0.09)',
      expected: { model: 'oklab', l: 0.63, a: 0.24, b: 0.09 },
    },
    {
      input: 'oklab(50% 25% -30%)',
      expected: { model: 'oklab', l: 50, a: 0.1, b: -0.12 },
    },
    {
      input: 'oklch(75% 49% 180)',
      expected: { model: 'oklch', l: 75, c: 0.196, h: 180 },
    },
    // 0% boundary values
    {
      input: 'oklab(0% 0% 0%)',
      expected: { model: 'oklab', l: 0, a: 0, b: 0 },
    },
    {
      input: 'oklch(0% 0% 0)',
      expected: { model: 'oklch', l: 0, c: 0, h: 0 },
    },
    // 100% boundary values
    {
      input: 'oklab(100% 100% 100%)',
      expected: { model: 'oklab', l: 100, a: 0.4, b: 0.4 },
    },
    {
      input: 'oklch(100% 100% 360)',
      expected: { model: 'oklch', l: 100, c: 0.4, h: 360 },
    },
    // Negative percentages for OkLab a/b
    {
      input: 'oklab(50% -100% -100%)',
      expected: { model: 'oklab', l: 50, a: -0.4, b: -0.4 },
    },
    {
      input: 'hsla(344 ,   100%,    50%   ,  0.4)',
      expected: { model: 'hsl', h: 344, s: 100, l: 50, alpha: 0.4 },
    },
    // Angle units for HSL hue
    {
      input: 'hsl(120deg 100% 50%)',
      expected: { model: 'hsl', h: 120, s: 100, l: 50 },
    },
    {
      input: 'hsl(0.5turn 100% 50%)',
      expected: { model: 'hsl', h: 180, s: 100, l: 50 },
    },
    {
      input: 'hsl(3.141592653589793rad 100% 50%)',
      expected: { model: 'hsl', h: 180, s: 100, l: 50 },
    },
    {
      input: 'hsl(200grad 100% 50%)',
      expected: { model: 'hsl', h: 180, s: 100, l: 50 },
    },
    // Angle units for OkLCH hue
    {
      input: 'oklch(0.5 0.2 180deg)',
      expected: { model: 'oklch', l: 0.5, c: 0.2, h: 180 },
    },
    {
      input: 'oklch(0.5 0.2 0.5turn)',
      expected: { model: 'oklch', l: 0.5, c: 0.2, h: 180 },
    },
    {
      input: 'oklch(0.5 0.2 3.141592653589793rad)',
      expected: { model: 'oklch', l: 0.5, c: 0.2, h: 180 },
    },
    // none keyword (CSS Color Level 4)
    {
      input: 'rgb(none 128 255)',
      expected: { model: 'rgb', r: 0, g: 128, b: 255 },
    },
    {
      input: 'hsl(none 50% 50%)',
      expected: { model: 'hsl', h: 0, s: 50, l: 50 },
    },
    {
      input: 'oklab(none 0.1 -0.1)',
      expected: { model: 'oklab', l: 0, a: 0.1, b: -0.1 },
    },
    {
      input: 'oklch(0.5 none 180)',
      expected: { model: 'oklch', l: 0.5, c: 0, h: 180 },
    },
  ])('should return properly for $input', ({ input, expected }) => {
    expect(extractColorParts(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    expect(() => extractColorParts('rgb(255, 255)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(255, 255, aa)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('hsl(255, 80)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklab(0.34, 0.5)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklch(34%, 0.5)')).toThrow(MESSAGES.invalidCSS);

    // Invalid percentage ranges
    expect(() => extractColorParts('oklab(50% 200% 0%)')).toThrow(MESSAGES.invalidRange);
    expect(() => extractColorParts('oklch(50% 150% 180)')).toThrow(MESSAGES.invalidRange);
  });
});
