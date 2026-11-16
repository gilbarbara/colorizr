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
      expected: 'rgb(255, 0, 68, 90%)',
    },
    { input: '#f00', options: { alpha: 0.5 }, expected: '#ff000080' },
    { input: '#f00', options: { alpha: 1 }, expected: '#f00' },
    { input: '#f008', options: undefined, expected: '#ff000088' },
    { input: '#ff000080', options: { alpha: 1 }, expected: '#ff0000' },
    { input: '#ff000080', options: { format: 'rgb' }, expected: 'rgb(255 0 0 / 50%)' },
    {
      input: { r: 255, g: 0, b: 0, alpha: 0.5 },
      options: undefined,
      expected: 'rgb(255 0 0 / 50%)',
    },
    { input: { r: 255, g: 0, b: 0, alpha: 0.5 }, options: 'hex', expected: '#ff000080' },
    {
      input: { r: 255, g: 0, b: 0, alpha: 0.5 },
      options: { format: 'hsl', alpha: 1 },
      expected: 'hsl(0 100% 50%)',
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

  it('should round rgb and hsl channels to the precision', () => {
    expect(formatCSS({ r: 255, g: 88.00944361065868, b: 67.466651796988 })).toBe(
      'rgb(255 88.009 67.467)',
    );
    expect(formatCSS({ h: 6.571234567, s: 100, l: 63.2345678 })).toBe('hsl(6.5712 100% 63.235%)');
    expect(formatCSS({ r: 255, g: 88.00944361065868, b: 0 }, { precision: 3 })).toBe(
      'rgb(255 88 0)',
    );
  });

  it('should throw with invalid input', () => {
    // @ts-expect-error - invalid color model shape
    expect(() => formatCSS({ r: 10, g: 10, s: 10 })).toThrow('invalid input');
    // @ts-expect-error - invalid hex (no #)
    expect(() => formatCSS('f04')).toThrow('invalid input');
  });

  it.each([2, 50, -0.5])('should throw for alpha %s outside 0-1', alpha => {
    expect(() => formatCSS({ r: 255, g: 0, b: 0 }, { format: 'rgb', alpha })).toThrow(
      'alpha must be a number between 0 and 1',
    );
  });
});
