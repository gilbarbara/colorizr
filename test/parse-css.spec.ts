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

  it.each([{ input: 'red' }, { input: ' red ' }, { input: '\tRED\n' }])(
    'should parse named color $input to hex when no format is given',
    ({ input }) => {
      expect(parseCSS(input)).toBe('#ff0000');
    },
  );

  it.each([
    { input: 'oklch(0.5% 0 0)', format: 'oklch', expected: 0.005 },
    { input: 'oklch(1% 0 0)', format: 'oklch', expected: 0.01 },
    { input: 'oklch(1.5% 0 0)', format: 'oklch', expected: 0.015 },
    { input: 'oklab(0.5% 0 0)', format: 'oklab', expected: 0.005 },
    { input: 'oklab(1% 0 0)', format: 'oklab', expected: 0.01 },
    { input: 'oklab(1.5% 0 0)', format: 'oklab', expected: 0.015 },
  ])('should parse $input lightness as a percentage', ({ input, format, expected }) => {
    expect(parseCSS(input, format as 'oklab' | 'oklch').l).toBe(expected);
  });

  it.each([
    'oklch(150% 0 0)',
    'oklab(-1% 0 0)',
    'oklch(1.2 0 0)',
    'oklab(-0.2 0 0)',
    'oklch(0.7 -0.1 30)',
  ])('should reject out-of-range lightness or chroma in %s', input => {
    expect(() => parseCSS(input, 'hex')).toThrow(MESSAGES.invalidColor);
  });

  it('should convert chroma and a/b beyond the typical range', () => {
    expect(parseCSS('oklch(0.7 1.5 30)', 'oklch')).toEqual({ l: 0.7, c: 1.5, h: 30 });
    expect(parseCSS('oklch(0.7 1.5 30)', 'hex')).toEqual(expect.any(String));
    expect(parseCSS('oklab(0.7 1.2 -1.5)', 'rgb')).toEqual(expect.any(Object));
  });

  it.each(['rgb(255 0 0 / 0)', 'rgb(255 0 0 / 0%)', 'rgb(255 0 0 / none)', 'hsl(0 100% 50% / 0)'])(
    'should keep a zero alpha in hex output for %s',
    input => {
      expect(parseCSS(input, 'hex')).toBe('#ff000000');
    },
  );

  it('should ignore surrounding CSS whitespace', () => {
    expect(parseCSS(' #ff0000\n', 'rgb')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseCSS('\tred ', 'hex')).toBe('#ff0000');
    expect(parseCSS('  rgb(255 0 0)  ', 'hex')).toBe('#ff0000');
    expect(() => parseCSS('rgb(255 0 0);')).toThrow('invalid CSS string');
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
