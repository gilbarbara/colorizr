import { MESSAGES } from '~/modules/constants';

import swatch, { SwatchOptions } from '~/swatch';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('swatch', () => {
  it.each([
    [brightPink.hex, undefined],
    [brightPink.hex, { mode: 'light' }],
    [brightPink.hex, { mode: 'dark' }],
    [brightPink.hex, { format: 'oklch' }],
    [green.hslString, undefined],
    [green.hslString, { scale: 'linear' }],
    [green.hslString, { variant: 'deep' }],
    [orange.oklabString, undefined],
    [orange.oklabString, { variant: 'neutral' }],
    [violet.oklchString, undefined],
    [violet.oklchString, { variant: 'pastel' }],
    [yellow.rgbString, undefined],
    [yellow.rgbString, { variant: 'subtle' }],
    ['oklch(0.65 0.3 27.34)', undefined],
    ['#d4ffc7', { variant: 'vibrant' }],
    ['#808080', { monochromatic: true }],
    ['#808080', { monochromatic: true, scale: 'linear' }],
  ] as Array<[string, SwatchOptions]>)(
    'should return properly with %s and %s',
    (input, variant) => {
      expect(swatch(input, variant)).toMatchSnapshot();
    },
  );

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => swatch(undefined)).toThrow(MESSAGES.inputString);
  });
});
