import { MESSAGES } from '~/modules/constants';
import swatch, { type SwatchOptions } from '~/swatch';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('swatch', () => {
  it.each<[string, SwatchOptions | undefined]>([
    [brightPink.hex, undefined],
    [brightPink.hex, { maxLightness: 0.9 }],
    [brightPink.hex, { minLightness: 0.1 }],
    [brightPink.hex, { format: 'oklch' }],
    [green.hslString, undefined],
    [green.hslString, { scale: 'fixed' }],
    [green.hslString, { variant: 'deep' }],
    [orange.oklabString, undefined],
    [orange.oklabString, { lightnessFactor: 1.2 }],
    [orange.oklabString, { variant: 'neutral' }],
    [violet.oklchString, undefined],
    [violet.oklchString, { variant: 'pastel' }],
    [yellow.rgbString, undefined],
    [yellow.rgbString, { variant: 'subtle' }],
    ['oklch(0.65 0.3 27.34)', undefined],
    ['#d4ffc7', { variant: 'vibrant' }],
    ['#808080', undefined],
  ])('should return properly with %s and %s', (input, options) => {
    expect(swatch(input, options)).toMatchSnapshot();
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => swatch(undefined)).toThrow(MESSAGES.inputString);
  });
});
