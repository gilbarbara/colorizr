import isValidColor from '~/is-valid-color';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('isValidColor', () => {
  it.each([
    [brightPink.hex, true],
    [addOpacityToCssString(brightPink.hex, 0.5), true],
    [green.hslString, true],
    [addOpacityToCssString(green.hslString, 0.9), true],
    [addOpacityToCssString(green.hslString, 90, true), true],
    [orange.oklabString, true],
    [addOpacityToCssString(orange.oklabString, 80, true), true],
    [violet.oklchString, true],
    [addOpacityToCssString(violet.oklchString, 90, true), true],
    ['oklch(75% 49% 180)', true],
    ['oklab(50% 25% -30%)', true],
    [yellow.rgbString, true],
    [addOpacityToCssString(yellow.rgbString, 0.9), true],
    [addOpacityToCssString(yellow.rgbString, 90, true), true],
    ['blue', true],
    ['aliceblue', true],
    ['#mmff00', false],
    ['blue-ish', false],
  ])('should validate %s to be %s', (input, expected) => {
    expect(isValidColor(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(isValidColor()).toBe(false);
    // @ts-expect-error - invalid parameters
    expect(isValidColor([])).toBe(false);
    // @ts-expect-error - invalid parameters
    expect(isValidColor({})).toBe(false);
  });
});
