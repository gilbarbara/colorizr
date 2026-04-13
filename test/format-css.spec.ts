import formatCSS, { FormatCSSOptions } from '~/format-css';

import { ColorValue } from '~/types';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('formatCSS', () => {
  it.each([
    {
      input: addOpacityToCssString(brightPink.hex, 0.8),
      options: { alpha: 0.9 },
      expected: addOpacityToCssString(brightPink.hex, 0.9),
    },
    {
      input: brightPink.hex,
      options: { alpha: 0.9, format: 'rgb', separator: ', ' },
      expected: addOpacityToCssString(brightPink.rgbString.replace(/ /g, ', '), 0.9, true),
    },
    { input: green.hsl, options: undefined, expected: green.hslString },
    {
      input: green.hsl,
      options: { alpha: 0.5, format: 'rgb' },
      expected: addOpacityToCssString(green.rgbString, 0.5, true),
    },
    { input: green.hsl, options: { format: 'hsl' }, expected: green.hslString },
    { input: orange.oklab, options: undefined, expected: orange.oklabString },
    { input: orange.oklab, options: { format: 'oklch' }, expected: orange.oklchString },
    { input: violet.oklch, options: undefined, expected: violet.oklchString },
    {
      input: violet.oklch,
      options: { alpha: 0.8, format: 'oklab' },
      expected: addOpacityToCssString(violet.oklabString, 0.8, true),
    },
    { input: yellow.rgb, options: undefined, expected: yellow.rgbString },
    {
      input: yellow.rgb,
      options: { alpha: 0.8, format: 'hex' },
      expected: addOpacityToCssString(yellow.hex, 0.8),
    },
  ])(`$input with $options should return $expected`, ({ input, options, expected }) => {
    expect(formatCSS(input as ColorValue, options as FormatCSSOptions)).toBe(expected);
  });

  describe('string shorthand', () => {
    it('should accept format as string', () => {
      expect(formatCSS(green.hsl, 'rgb')).toBe(green.rgbString);
      expect(formatCSS(yellow.rgb, 'hex')).toBe(yellow.hex);
      expect(formatCSS(orange.oklab, 'oklch')).toBe(orange.oklchString);
    });

    it('should match object form', () => {
      expect(formatCSS(violet.oklch, 'hsl')).toBe(formatCSS(violet.oklch, { format: 'hsl' }));
    });
  });

  it('should throw with invalid input', () => {
    // @ts-expect-error - invalid color model shape
    expect(() => formatCSS({ r: 10, g: 10, s: 10 })).toThrow('invalid input');
    // @ts-expect-error - invalid hex (no #)
    expect(() => formatCSS('f04')).toThrow('invalid input');
  });
});
