import { MESSAGES } from '~/modules/constants';

import swatch, { SwatchOptions } from '~/swatch';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('swatch', () => {
  it.each([
    [brightPink.hex, undefined],
    [brightPink.hex, { format: 'oklch' }],
    [green.hslString, undefined],
    [green.hslString, { scale: 'linear' }],
    [orange.oklabString, undefined],
    [violet.oklchString, undefined],
    [yellow.rgbString, undefined],
    ['oklch(0.65 0.3 27.34)', undefined],
    ['#808080', { monochromatic: true }],
    ['#808080', { monochromatic: true, scale: 'linear' }],
  ] as Array<[string, SwatchOptions]>)(
    'should return properly with %s with %s',
    (input, variant) => {
      expect(swatch(input, variant)).toMatchSnapshot();
    },
  );

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => swatch(undefined)).toThrow(MESSAGES.inputString);
  });
});
