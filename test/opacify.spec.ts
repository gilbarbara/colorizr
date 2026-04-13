import { MESSAGES } from '~/modules/constants';
import opacify from '~/opacify';

import { ColorType } from '~/types';

import { addOpacityToCssString, brightPink, green, violet, yellow } from './__fixtures__';

describe('opacify', () => {
  it.each([
    {
      input: 'darkgoldenrod',
      amount: 0.1,
      format: 'hsl',
      expected: 'hsl(42.66 88.72% 38.24% / 10%)',
    },
    {
      input: 'cadetblue',
      amount: 0.25,
      format: 'oklab',
      expected: 'oklab(65.768% -0.06172 -0.02041 / 25%)',
    },
    {
      input: 'coral',
      amount: 0.325,
      format: 'oklch',
      expected: 'oklch(73.511% 0.16799 40.247 / 32.5%)',
    },
    { input: 'forestgreen', amount: 0.5, format: 'rgb', expected: 'rgb(34 139 34 / 50%)' },
    { input: brightPink.hex, amount: 0.8, format: 'hex', expected: `${brightPink.hex}cc` },
    {
      input: addOpacityToCssString(brightPink.hex, 0.8),
      amount: 0.1,
      format: 'hex',
      expected: `${brightPink.hex}1a`,
    },
    {
      input: brightPink.hex,
      amount: 0.9,
      format: 'hsl',
      expected: addOpacityToCssString(brightPink.hslString, 0.9, true),
    },
    {
      input: green.hex,
      amount: 0.5,
      format: 'oklab',
      expected: addOpacityToCssString(green.oklabString, 0.5, true),
    },
    {
      input: green.hex,
      amount: 0.5,
      format: 'oklch',
      expected: addOpacityToCssString(green.oklchString, 0.5, true),
    },
    {
      input: violet.hex,
      amount: 0.1,
      format: 'rgb',
      expected: addOpacityToCssString(violet.rgbString, 0.1, true),
    },
    {
      input: violet.hslString,
      amount: 0.8,
      format: 'oklch',
      expected: addOpacityToCssString(violet.oklchString, 0.8, true),
    },
    {
      input: addOpacityToCssString(brightPink.rgbString, 0.4),
      amount: 0.3,
      format: 'rgb',
      expected: addOpacityToCssString(brightPink.rgbString, 0.3, true),
    },
    { input: violet.oklabString, amount: 0.1, format: 'hex', expected: `${violet.hex}1a` },
    { input: yellow.oklchString, amount: 0.8, format: 'hex', expected: `${yellow.hex}cc` },
    {
      input: yellow.rgbString,
      amount: 0.5,
      format: 'hsl',
      expected: yellow.hslString.replace(')', ' / 50%)'),
    },
    {
      input: yellow.rgbString,
      amount: 0.5,
      format: undefined,
      expected: yellow.rgbString.replace(')', ' / 50%)'),
    },
    {
      input: addOpacityToCssString(yellow.rgbString, 0.3),
      amount: 0.2,
      format: 'hex',
      expected: `${yellow.hex}33`,
    },
  ])(
    '$input with $amount and $format should return $expected',
    ({ input, amount, format, expected }) => {
      expect(opacify(input, amount, format as ColorType)).toBe(expected);
    },
  );

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => opacify([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => opacify('pink', '')).toThrow(MESSAGES.alpha);
  });
});
