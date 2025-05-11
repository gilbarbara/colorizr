import convert from '~/convert';

import { ColorType } from '~/types';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('convert', () => {
  it.each([
    [{ input: brightPink.hex, format: 'hsl', expected: brightPink.hslString }],
    [{ input: brightPink.hex, format: 'oklab', expected: brightPink.oklabString }],
    [{ input: brightPink.hex, format: 'oklch', expected: brightPink.oklchString }],
    [{ input: brightPink.hex, format: 'rgb', expected: brightPink.rgbString }],
    [{ input: green.hslString, format: 'hex', expected: green.hex }],
    [{ input: green.hslString, format: 'oklab', expected: green.oklabString }],
    [{ input: green.hslString, format: 'oklch', expected: green.oklchString }],
    [{ input: green.hslString, format: 'rgb', expected: green.rgbString }],
    [{ input: orange.oklabString, format: 'hex', expected: orange.hex }],
    [{ input: orange.oklabString, format: 'hsl', expected: orange.hslString }],
    [{ input: orange.oklabString, format: 'oklch', expected: orange.oklchString }],
    [{ input: orange.oklabString, format: 'rgb', expected: orange.rgbString }],
    [{ input: violet.oklchString, format: 'hex', expected: violet.hex }],
    [{ input: violet.oklchString, format: 'hsl', expected: violet.hslString }],
    [{ input: violet.oklchString, format: 'oklab', expected: violet.oklabString }],
    [{ input: violet.oklchString, format: 'rgb', expected: violet.rgbString }],
    [{ input: yellow.rgbString, format: 'hex', expected: yellow.hex }],
    [{ input: yellow.rgbString, format: 'hsl', expected: yellow.hslString }],
    [{ input: yellow.rgbString, format: 'oklab', expected: yellow.oklabString }],
    [{ input: yellow.rgbString, format: 'oklch', expected: yellow.oklchString }],
  ])('should convert $input to $expected', ({ input, format, expected }) => {
    expect(convert(input, format as ColorType)).toBe(expected);
  });
});
