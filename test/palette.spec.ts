import { MESSAGES } from '~/modules/constants';
import palette from '~/palette';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('palette', () => {
  it.each([
    { input: brightPink.hex, options: undefined },
    { input: green.hslString, options: { monochromatic: true } },
    { input: orange.oklabString, options: { size: 24 } },
    { input: violet.oklchString, options: { lightness: 90, size: 10 } },
    { input: yellow.rgbString, options: { saturation: 70, size: 5 } },
    { input: 'blue', options: undefined },
  ])('$input with $options should return the palette', ({ input, options }) => {
    expect(palette(input, options)).toMatchSnapshot();
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => palette([])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => palette('#f04', [])).toThrow('invalid options');
  });
});
