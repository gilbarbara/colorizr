import { MESSAGES } from '~/modules/constants';

import opacify from '~/opacify';
import { ColorModelKey } from '~/types';

import { addOpacityToCssString, brightPink, green, violet, yellow } from './__fixtures__';

describe('opacify', () => {
  it.each([
    ['darkgoldenrod', 0.1, 'hsl', 'hsl(42.66 88.72% 38.24% / 10%)'],
    ['cadetblue', 0.25, 'oklab', 'oklab(65.768% -0.06172 -0.02041 / 25%)'],
    ['coral', 0.325, 'oklch', 'oklch(73.511% 0.168 40.24617 / 32.5%)'],
    ['forestgreen', 0.5, 'rgb', 'rgb(34 139 34 / 50%)'],
    [brightPink.hex, 0.8, 'hex', `${brightPink.hex}cc`],
    [addOpacityToCssString(brightPink.hex, 0.8), 0.1, 'hex', `${brightPink.hex}1a`],
    [brightPink.hex, 0.9, 'hsl', addOpacityToCssString(brightPink.hslString, 90, true)],
    [green.hex, 0.5, 'oklab', addOpacityToCssString(green.oklabString, 50, true)],
    [green.hex, 0.5, 'oklch', addOpacityToCssString(green.oklchString, 50, true)],
    [violet.hex, 0.1, 'rgb', addOpacityToCssString(violet.rgbString, 10, true)],
    [violet.hslString, 0.8, 'oklch', addOpacityToCssString(violet.oklchString, 80, true)],
    [
      addOpacityToCssString(brightPink.rgbString, 0.4),
      0.3,
      'rgb',
      addOpacityToCssString(brightPink.rgbString, 30, true),
    ],
    [violet.oklabString, 0.1, 'hex', `${violet.hex}1a`],
    [yellow.oklchString, 0.8, 'hex', `${yellow.hex}cc`],
    [yellow.rgbString, 0.5, 'hsl', yellow.hslString.replace(')', ' / 50%)')],
    [yellow.rgbString, 0.5, undefined, yellow.rgbString.replace(')', ' / 50%)')],
    [addOpacityToCssString(yellow.rgbString, 0.3), 0.2, 'hex', `${yellow.hex}33`],
  ] as Array<[string, number, string | undefined, string]>)(
    '%s with %s and %s should return %s',
    (input, amount, output, expected) => {
      expect(opacify(input, amount, output as ColorModelKey)).toBe(expected);
    },
  );

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => opacify([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => opacify('pink', '')).toThrow(MESSAGES.alpha);
  });
});
