import { MESSAGES } from '~/modules/constants';
import parseCSS from '~/parse-css';

import { ColorType } from '~/types';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('parseCSS', () => {
  describe.each([
    { output: 'hex' },
    { output: 'hsl' },
    { output: 'oklab' },
    { output: 'oklch' },
    { output: 'rgb' },
  ])('with output $output', ({ output }) => {
    it.each([
      { input: brightPink.hex },
      { input: addOpacityToCssString(brightPink.hex, 0.8) },
      { input: green.hslString },
      { input: addOpacityToCssString(green.hslString, 0.5) },
      { input: addOpacityToCssString(green.hslString, 0.9, true) },
      { input: orange.oklabString },
      { input: addOpacityToCssString(orange.oklabString, 0.9, true) },
      { input: violet.oklchString },
      { input: addOpacityToCssString(violet.oklchString, 0.9, true) },
      { input: yellow.rgbString },
      { input: addOpacityToCssString(yellow.rgbString, 0.9) },
      { input: addOpacityToCssString(yellow.rgbString, 0.9, true) },
      { input: 'hsla(126,     57%,  62%,0.5)' },
      { input: 'AliceBlue' },
      { input: 'greenyellow' },
    ])('$input should return properly', ({ input }) => {
      expect(parseCSS(input, output as ColorType)).toMatchSnapshot();
    });
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => parseCSS()).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => parseCSS([25, 56, 84])).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => parseCSS({ h: 25, s: 56, l: 84 })).toThrow(MESSAGES.inputString);
    expect(() => parseCSS('rgb(255, 255)')).toThrow('invalid CSS string');
    expect(() => parseCSS('rgs(255, 255, 0)')).toThrow('invalid CSS string');
    expect(() => parseCSS('AliceGreen')).toThrow('invalid CSS string');
    expect(() => parseCSS('green-ish')).toThrow('invalid CSS string');
  });
});
