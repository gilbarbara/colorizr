import { MESSAGES } from '~/modules/constants';

import extractColorParts from '~/extract-color-parts';

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
      input: addOpacityToCssString(violet.oklabString, 85, true),
      expected: { model: 'oklab', ...violet.oklab, l: 47.642, alpha: 0.85 },
    },
    {
      input: yellow.oklchString,
      expected: { model: 'oklch', ...yellow.oklch, l: 92.235 },
    },
    {
      input: addOpacityToCssString(yellow.oklchString, 95, true),
      expected: { model: 'oklch', ...yellow.oklch, l: 92.235, alpha: 0.95 },
    },
    {
      input: 'oklab(0.63 0.24 0.09)',
      expected: { model: 'oklab', l: 0.63, a: 0.24, b: 0.09 },
    },
    {
      input: 'hsla(344 ,   100%,    50%   ,  0.4)',
      expected: { model: 'hsl', h: 344, s: 100, l: 50, alpha: 0.4 },
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
  });
});
