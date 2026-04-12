import scheme, { Scheme, SchemeOptions } from '~/scheme';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('scheme', () => {
  it.each<[{ input: string; options?: Scheme | SchemeOptions }]>([
    [{ input: brightPink.hex, options: undefined }],
    [{ input: brightPink.hex, options: 'complementary' }],
    [{ input: green.hslString, options: { scheme: 'analogous' } }],
    [{ input: green.hslString, options: { scheme: 'split' } }],
    [{ input: orange.oklabString, options: { scheme: 'split-complementary' } }],
    [{ input: orange.oklabString, options: { scheme: 'triadic' } }],
    [{ input: violet.oklchString, options: { scheme: 'tetradic' } }],
    [{ input: violet.oklchString, options: { scheme: 'rectangle' } }],
    [{ input: yellow.rgbString, options: { scheme: 'square' } }],
    [{ input: 'AliceBlue', options: undefined }],
  ])('should return properly with $input with $options', ({ input, options }) => {
    expect(scheme(input, options)).toMatchSnapshot();
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => scheme('#f04', 'invalidType')).toThrow('invalid type');
  });
});
