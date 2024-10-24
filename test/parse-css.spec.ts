import { MESSAGES } from '~/modules/constants';

import parseCSS from '~/parse-css';
import { ColorType } from '~/types';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('parseCSS', () => {
  describe.each([['hex'], ['hsl'], ['oklab'], ['oklch'], ['rgb']] as ColorType[][])(
    'with output %s',
    output => {
      it.each([
        [brightPink.hex],
        [addOpacityToCssString(brightPink.hex, 0.8)],
        [green.hslString],
        [addOpacityToCssString(green.hslString, 0.5)],
        [addOpacityToCssString(green.hslString, 90, true)],
        [orange.oklabString],
        [addOpacityToCssString(orange.oklabString, 90, true)],
        [violet.oklchString],
        [addOpacityToCssString(violet.oklchString, 90, true)],
        [yellow.rgbString],
        [addOpacityToCssString(yellow.rgbString, 0.9)],
        [addOpacityToCssString(yellow.rgbString, 90, true)],
        ['hsla(126,     57%,  62%,0.5)'],
        ['AliceBlue'],
        ['greenyellow'],
      ])('%s should return properly', input => {
        expect(parseCSS(input, output)).toMatchSnapshot();
      });
    },
  );

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
