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

  // Expected values follow CSS Color 4: channels and alpha clamped, hue wrapped to [0, 360)
  it.each([
    { input: 'rgb(300 0 0)', expected: '#ff0000' },
    { input: 'rgb(-10 0 0)', expected: '#000000' },
    { input: 'rgb(200% 0 0)', expected: '#ff0000' },
    { input: 'hsl(400 50% 50%)', expected: '#bf9540' },
    { input: 'hsl(-30 50% 50%)', expected: '#bf4080' },
    { input: 'hsl(120 150% 50%)', expected: '#00ff00' },
    // Saturation above 100% is capped as Chrome does; at 50% lightness capping is indistinguishable
    { input: 'hsl(0 150% 25%)', expected: '#800000' },
    { input: 'hsl(120 200% 30%)', expected: '#009900' },
    { input: 'hsl(120 50% -10%)', expected: '#000000' },
    { input: 'oklch(150% 0 0)', expected: '#ffffff' },
    { input: 'oklch(1.2 0 0)', expected: '#ffffff' },
    { input: 'oklab(-1% 0 0)', expected: '#000000' },
    { input: 'oklab(-0.2 0 0)', expected: '#000000' },
    { input: 'oklab(1.2 0 0)', expected: '#ffffff' },
    { input: 'oklch(0.7 -0.1 30)', expected: '#9e9e9e' },
    { input: 'oklch(0.7 0.1 400)', expected: '#d4896e' },
    { input: 'oklch(0.7 0.1 -30)', expected: '#c287bc' },
    { input: 'rgb(255 0 0 / 2)', expected: '#ff0000' },
    { input: 'rgb(255 0 0 / 150%)', expected: '#ff0000' },
    { input: 'rgb(255 0 0 / -0.5)', expected: '#ff000000' },
  ])('should resolve out-of-range $input as CSS does', ({ input, expected }) => {
    expect(parseCSS(input, 'hex')).toBe(expected);
  });

  it('should clamp and wrap values in the input model', () => {
    expect(parseCSS('rgb(300 -10 128 / 2)')).toEqual({ r: 255, g: 0, b: 128 });
    expect(parseCSS('hsl(-30 150% 50%)')).toEqual({ h: 330, s: 100, l: 50 });
    expect(parseCSS('oklch(1.5 -0.1 400)')).toEqual({ l: 1, c: 0, h: 40 });
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

  it.each([
    { input: 'hsl(344, 100, 50)', expected: '#ff0044' },
    { input: 'hsla(344, 100% 50%, 0.5)', expected: '#ff004480' },
    { input: 'rgb(255, 0 68)', expected: '#ff0044' },
    { input: 'rgb(255 0 68, 0.5)', expected: '#ff004480' },
    { input: 'rgb(255 / 0 / 68)', expected: '#ff0044' },
    { input: 'rgb(255, 0%, 0)', expected: '#ff0000' },
    { input: 'rgb(none, 0, 0)', expected: '#000000' },
    { input: 'oklch(0.5, 0.1, 30)', expected: '#944b40' },
    { input: 'oklcha(0.5 0.1 30)', expected: '#944b40' },
    { input: 'rgb (255 0 68)', expected: '#ff0044' },
    { input: 'rgb(255 0 68)', expected: '#ff0044' },
  ])('should parse $input even though CSS rejects its syntax', ({ input, expected }) => {
    expect(parseCSS(input, 'hex')).toBe(expected);
  });

  it('should parse transparent as transparent black', () => {
    expect(parseCSS('transparent')).toBe('#00000000');
    expect(parseCSS('transparent', 'rgb')).toEqual({ r: 0, g: 0, b: 0, alpha: 0 });
  });

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
    expect(() => parseCSS('#1234567')).toThrow('invalid CSS string');
  });
});
