import { MESSAGES } from '~/modules/constants';
import palette, { PaletteOptions } from '~/palette';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('palette', () => {
  it.each([
    [brightPink.hex, undefined],
    [green.hslString, { type: 'monochromatic' }],
    [orange.oklabString, { size: 24 }],
    [violet.oklchString, { lightness: 90, size: 10 }],
    [yellow.rgbString, { saturation: 70, size: 5 }],
    ['blue', undefined],
  ] as Array<[string, PaletteOptions]>)(
    '%s with %s should return the palette',
    (input, options) => {
      expect(palette(input, options)).toMatchSnapshot();
    },
  );

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => palette([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => palette('#f04', [])).toThrow('invalid options');
  });
});
