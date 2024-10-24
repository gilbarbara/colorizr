import scheme, { SchemeOptions } from '~/scheme';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('scheme', () => {
  it.each<[{ input: string; options?: SchemeOptions }]>([
    [{ input: brightPink.hex, options: undefined }],
    [{ input: brightPink.hex, options: { type: 'complementary' } }],
    [{ input: green.hslString, options: { type: 'analogous' } }],
    [{ input: green.hslString, options: { type: 'split' } }],
    [{ input: orange.oklabString, options: { type: 'split-complementary' } }],
    [{ input: orange.oklabString, options: { type: 'triadic' } }],
    [{ input: violet.oklchString, options: { type: 'tetradic' } }],
    [{ input: violet.oklchString, options: { type: 'rectangle' } }],
    [{ input: yellow.rgbString, options: { type: 'square' } }],
    [{ input: 'AliceBlue', options: undefined }],
  ])('should return properly with $input and $options', ({ input, options }) => {
    expect(scheme(input, options)).toMatchSnapshot();
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => scheme('#f04', 'invalidType')).toThrow('invalid type');
  });
});
