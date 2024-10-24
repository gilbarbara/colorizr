import { MESSAGES } from '~/modules/constants';

import transparentize from '~/transparentize';
import { ColorModelKey } from '~/types';

import { addOpacityToCssString, brightPink, green, violet, yellow } from './__fixtures__';

describe('transparentize', () => {
  it.each([
    ['darkgoldenrod', 0.1, 'hsl', 'hsl(42.66 88.72% 38.24% / 90%)'],
    ['cadetblue', 0.1, 'oklab', 'oklab(65.768% -0.06172 -0.02041 / 90%)'],
    ['coral', 0.3, 'oklch', 'oklch(73.511% 0.168 40.24617 / 70%)'],
    ['forestgreen', 0.1, 'rgb', 'rgb(34 139 34 / 90%)'],
    [brightPink.hex, 0.1, 'hex', `${brightPink.hex}e6`],
    [`${brightPink.hex}00`, -0.2, 'hex', `${brightPink.hex}33`],
    [brightPink.hex, 0.1, 'hsl', addOpacityToCssString(brightPink.hslString, 90, true)],
    [green.hex, 0.1, 'oklab', addOpacityToCssString(green.oklabString, 90, true)],
    [green.hex, 0.1, 'oklch', addOpacityToCssString(green.oklchString, 90, true)],
    [violet.hex, 0.1, 'rgb', addOpacityToCssString(violet.rgbString, 90, true)],
    [violet.hslString, 0.1, 'oklch', addOpacityToCssString(violet.oklchString, 90, true)],
    ['hsl(344, 100, 50, 0.4)', 0.1, 'rgb', addOpacityToCssString(brightPink.rgbString, 30, true)],
    [violet.oklabString, 0.1, 'hex', `${violet.hex}e6`],
    [yellow.oklchString, 0.1, 'hex', `${yellow.hex}e6`],
    [yellow.rgbString, 0.5, 'hsl', yellow.hslString.replace(')', ' / 50%)')],
    [addOpacityToCssString(yellow.rgbString, 0.3), 0.2, 'hex', `${yellow.hex}1a`],
  ] as Array<[string, number, string, string]>)(
    '%s with %s and %s should return %s',
    (input, amount, output, expected) => {
      expect(transparentize(input, amount, output as ColorModelKey)).toBe(expected);
    },
  );

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => transparentize('')).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => transparentize('black', '')).toThrow(MESSAGES.alpha);
  });
});
