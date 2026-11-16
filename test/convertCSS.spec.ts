import convertCSS from '~/convertCSS';
import { MESSAGES } from '~/modules/constants';
import scale from '~/scale';

import { ColorType } from '~/types';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('convertCSS', () => {
  it.each([
    { input: brightPink.hex, format: 'hsl', expected: brightPink.hslString },
    { input: brightPink.hex, format: 'oklab', expected: brightPink.oklabString },
    { input: brightPink.hex, format: 'oklch', expected: brightPink.oklchString },
    { input: brightPink.hex, format: 'rgb', expected: brightPink.rgbString },
    { input: green.hslString, format: 'hex', expected: green.hex },
    { input: green.hslString, format: 'oklab', expected: green.oklabString },
    { input: green.hslString, format: 'oklch', expected: green.oklchString },
    { input: green.hslString, format: 'rgb', expected: green.rgbString },
    { input: orange.oklabString, format: 'hex', expected: orange.hex },
    { input: orange.oklabString, format: 'hsl', expected: orange.hslString },
    { input: orange.oklabString, format: 'oklch', expected: orange.oklchString },
    { input: orange.oklabString, format: 'rgb', expected: orange.rgbString },
    { input: violet.oklchString, format: 'hex', expected: violet.hex },
    { input: violet.oklchString, format: 'hsl', expected: violet.hslString },
    { input: violet.oklchString, format: 'oklab', expected: 'oklab(47.642% 0.0258 -0.29845)' },
    { input: violet.oklchString, format: 'rgb', expected: violet.rgbString },
    { input: yellow.rgbString, format: 'hex', expected: yellow.hex },
    { input: yellow.rgbString, format: 'hsl', expected: yellow.hslString },
    { input: yellow.rgbString, format: 'oklab', expected: yellow.oklabString },
    { input: yellow.rgbString, format: 'oklch', expected: yellow.oklchString },
  ])('should convert $input to $expected', ({ input, format, expected }) => {
    expect(convertCSS(input, format as ColorType)).toBe(expected);
  });

  it('should ignore surrounding CSS whitespace', () => {
    expect(convertCSS(' #ff0000 ', 'rgb')).toBe('rgb(255 0 0)');
    expect(convertCSS('\nred\t', 'hex')).toBe('#ff0000');
    expect(() => convertCSS('foo rgb(1 2 3)', 'hex')).toThrow('invalid CSS string');
  });

  it('should convert chroma beyond the typical range', () => {
    expect(convertCSS('oklch(0.7 1.5 30)', 'hex')).toBe('#ff0000');
    expect(() => convertCSS('oklch(0.7 -0.1 30)', 'hex')).toThrow(MESSAGES.invalidRange);
  });

  it('should throw on a hue just outside the range', () => {
    expect(() => convertCSS('hsl(360.000001 50% 50%)', 'hex')).toThrow(MESSAGES.invalidRange);
  });

  it('should throw on a lightness percentage just outside the range', () => {
    expect(() => convertCSS('oklch(100.00000000000004% 0 0)', 'hex')).toThrow(
      MESSAGES.invalidRange,
    );
  });

  it('should keep the alpha of 4-digit hex', () => {
    expect(convertCSS('#f008', 'hex')).toBe('#ff000088');
    expect(convertCSS('#f008', 'rgb')).toBe('rgb(255 0 0 / 53.3%)');
    expect(convertCSS('#f00', 'hex')).toBe('#f00');
  });

  it('should read alpha as written', () => {
    expect(convertCSS('rgb(255 0 0 / 1%)', 'hex')).toBe('#ff000003');
    expect(convertCSS('rgb(255 0 0 / 50%)', 'hex')).toBe('#ff000080');
    expect(() => convertCSS('rgb(255 0 0 / 2)', 'hex')).toThrow(MESSAGES.invalidRange);
    expect(() => convertCSS('rgb(255 0 0 / 150%)', 'hex')).toThrow(MESSAGES.invalidRange);
  });

  it.each(['rgb(300 0 0)', 'hsl(400 50% 50%)', 'hsl(0 150% 50%)', 'oklch(0.5 0.1 400)'])(
    'should reject out-of-range values in %s',
    input => {
      expect(() => convertCSS(input, 'hex')).toThrow(MESSAGES.invalidRange);
    },
  );

  it('should scale RGB percentages to 0-255', () => {
    expect(convertCSS('rgb(100% 0% 0%)', 'hex')).toBe('#ff0000');
    expect(convertCSS('rgb(0% 100% 0%)', 'rgb')).toBe('rgb(0 255 0)');
    expect(convertCSS('rgb(50% 0% 0%)', 'hex')).toBe('#800000');
    expect(() => convertCSS('rgb(200% 0 0)', 'hex')).toThrow(MESSAGES.invalidRange);
  });

  it('should round-trip scale output with lightness at or below 1%', () => {
    const input = 'oklch(23.28% 0.098 274.96)';
    const options = { minLightness: 0.01, maxLightness: 0.97, lightnessCurve: 1.3 };
    const step = scale(input, options)['950'];

    expect(step).toBe('oklch(1% 0.00887 274.96)');
    expect(convertCSS(step, 'hex')).toBe(scale(input, { ...options, format: 'hex' })['950']);
  });
});
