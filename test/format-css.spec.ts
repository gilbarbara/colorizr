import formatCSS, { FormatCSSOptions } from '~/format-css';

import { ColorModel, HEX } from '~/types';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('formatCSS', () => {
  it.each([
    [
      addOpacityToCssString(brightPink.hex, 0.8),
      { alpha: 0.9 },
      addOpacityToCssString(brightPink.hex, 0.9),
    ],
    [
      brightPink.hex,
      { alpha: 0.9, format: 'rgb', separator: ', ' },
      addOpacityToCssString(brightPink.rgbString.replace(/ /g, ', '), 90, true),
    ],
    [green.hsl, undefined, green.hex],
    [green.hsl, { alpha: 0.5, format: 'rgb' }, addOpacityToCssString(green.rgbString, 50, true)],
    [green.hsl, { format: 'hsl' }, green.hslString],
    [orange.oklab, undefined, orange.hex],
    [orange.oklab, { format: 'oklch' }, orange.oklchString],
    [violet.oklch, undefined, violet.hex],
    [
      violet.oklch,
      { alpha: 0.8, format: 'oklab' },
      addOpacityToCssString(violet.oklabString, 80, true),
    ],
    [yellow.rgb, undefined, yellow.hex],
    [yellow.rgb, { alpha: 0.8, format: 'hex' }, addOpacityToCssString(yellow.hex, 0.8)],
  ] as Array<[ColorModel | HEX, FormatCSSOptions | undefined, string]>)(
    `%s with %s should return %s`,
    (input, options, expected) => {
      expect(formatCSS(input, options)).toBe(expected);
    },
  );

  it('should throw with invalid input', () => {
    // @ts-expect-error - invalid color model shape
    expect(() => formatCSS({ r: 10, g: 10, s: 10 })).toThrow('invalid input');
    // @ts-expect-error - invalid hex (no #)
    expect(() => formatCSS('f04')).toThrow('invalid input');
  });
});
