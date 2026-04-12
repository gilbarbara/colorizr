import { MESSAGES } from '~/modules/constants';
import transparentize from '~/transparentize';

import { ColorType } from '~/types';

import { addOpacityToCssString, brightPink, green, violet, yellow } from './__fixtures__';

describe('transparentize', () => {
  it.each([
    {
      input: 'darkgoldenrod',
      amount: 0.1,
      format: 'hsl',
      expected: 'hsl(42.66 88.72% 38.24% / 90%)',
    },
    {
      input: 'cadetblue',
      amount: 0.1,
      format: 'oklab',
      expected: 'oklab(65.768% -0.06172 -0.02041 / 90%)',
    },
    {
      input: 'coral',
      amount: 0.3,
      format: 'oklch',
      expected: 'oklch(73.511% 0.16799 40.247 / 70%)',
    },
    { input: 'forestgreen', amount: 0.1, format: 'rgb', expected: 'rgb(34 139 34 / 90%)' },
    { input: brightPink.hex, amount: 0.1, expected: `${brightPink.hex}e6` },
    { input: `${brightPink.hex}00`, amount: -0.2, format: 'hex', expected: `${brightPink.hex}33` },
    {
      input: brightPink.hex,
      amount: 0.1,
      format: 'hsl',
      expected: addOpacityToCssString(brightPink.hslString, 0.9, true),
    },
    {
      input: green.hex,
      amount: 0.1,
      format: 'oklab',
      expected: addOpacityToCssString(green.oklabString, 0.9, true),
    },

    {
      input: green.hex,
      amount: 0.1,
      format: 'oklch',
      expected: addOpacityToCssString(green.oklchString, 0.9, true),
    },
    {
      input: violet.hex,
      amount: 0.1,
      format: 'rgb',
      expected: addOpacityToCssString(violet.rgbString, 0.9, true),
    },
    {
      input: violet.hslString,
      amount: 0.1,
      format: 'oklch',
      expected: addOpacityToCssString(violet.oklchString, 0.9, true),
    },
    {
      input: 'hsl(344, 100, 50, 0.4)',
      amount: 0.1,
      format: 'rgb',
      expected: addOpacityToCssString(brightPink.rgbString, 0.3, true),
    },
    { input: violet.oklabString, amount: 0.1, format: 'hex', expected: `${violet.hex}e6` },
    { input: yellow.oklchString, amount: 0.1, format: 'hex', expected: `${yellow.hex}e6` },
    {
      input: yellow.rgbString,
      amount: 0.5,
      format: 'hsl',
      expected: yellow.hslString.replace(')', ' / 50%)'),
    },
    {
      input: addOpacityToCssString(yellow.rgbString, 0.3),
      amount: 0.2,
      format: 'hex',
      expected: `${yellow.hex}1a`,
    },
  ])(
    '$input with $amount and $format should return $expected',
    ({ input, amount, format, expected }) => {
      expect(transparentize(input, amount, format as ColorType)).toBe(expected);
    },
  );

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => transparentize('')).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => transparentize('black', '')).toThrow(MESSAGES.alphaAdjustment);
  });
});
