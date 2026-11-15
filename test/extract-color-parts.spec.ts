import extractColorParts from '~/extract-color-parts';
import { MESSAGES } from '~/modules/constants';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('extractColorParts', () => {
  it.each([
    {
      input: brightPink.hex,
      expected: { model: 'rgb', ...brightPink.rgb },
    },
    {
      input: addOpacityToCssString(brightPink.hex, 0.9),
      expected: { model: 'rgb', ...brightPink.rgb, alpha: 0.9 },
    },
    {
      input: green.rgbString,
      expected: { model: 'rgb', ...green.rgb },
    },
    {
      input: addOpacityToCssString(green.rgbString, 0.4),
      expected: { model: 'rgb', ...green.rgb, alpha: 0.4 },
    },
    {
      input: orange.hslString,
      expected: { model: 'hsl', ...orange.hsl },
    },
    {
      input: violet.oklabString,
      expected: { model: 'oklab', ...violet.oklab },
    },
    {
      input: addOpacityToCssString(violet.oklabString, 0.85, true),
      expected: { model: 'oklab', ...violet.oklab, alpha: 0.85 },
    },
    {
      input: yellow.oklchString,
      expected: { model: 'oklch', l: 0.92235, c: 0.14274, h: 97.778 },
    },
    {
      input: addOpacityToCssString(yellow.oklchString, 0.95, true),
      expected: { model: 'oklch', l: 0.92235, c: 0.14274, h: 97.778, alpha: 0.95 },
    },
    {
      input: 'oklab(0.63 0.24 0.09)',
      expected: { model: 'oklab', l: 0.63, a: 0.24, b: 0.09 },
    },
    {
      input: 'oklab(50% 25% -30%)',
      expected: { model: 'oklab', l: 0.5, a: 0.1, b: -0.12 },
    },
    {
      input: 'oklch(75% 49% 180)',
      expected: { model: 'oklch', l: 0.75, c: 0.196, h: 180 },
    },
    // 0% boundary values
    {
      input: 'oklab(0% 0% 0%)',
      expected: { model: 'oklab', l: 0, a: 0, b: 0 },
    },
    {
      input: 'oklch(0% 0% 0)',
      expected: { model: 'oklch', l: 0, c: 0, h: 0 },
    },
    // 100% boundary values
    {
      input: 'oklab(100% 100% 100%)',
      expected: { model: 'oklab', l: 1, a: 0.4, b: 0.4 },
    },
    {
      input: 'oklch(100% 100% 360)',
      expected: { model: 'oklch', l: 1, c: 0.4, h: 360 },
    },
    // Alpha is read as written: a percentage is divided by 100, a number is kept
    {
      input: 'rgb(255 0 0 / 1%)',
      expected: { model: 'rgb', r: 255, g: 0, b: 0, alpha: 0.01 },
    },
    {
      input: 'rgb(255 0 0 / 0.5%)',
      expected: { model: 'rgb', r: 255, g: 0, b: 0, alpha: 0.005 },
    },
    {
      input: 'rgb(255 0 0 / 2)',
      expected: { model: 'rgb', r: 255, g: 0, b: 0, alpha: 2 },
    },
    // RGB percentages scale to 0-255
    {
      input: 'rgb(100% 0% 0%)',
      expected: { model: 'rgb', r: 255, g: 0, b: 0 },
    },
    {
      input: 'rgb(100%, 50%, 0%)',
      expected: { model: 'rgb', r: 255, g: 127.5, b: 0 },
    },
    {
      input: 'rgb(200% 0 0)',
      expected: { model: 'rgb', r: 510, g: 0, b: 0 },
    },
    // Negative percentages for OkLab a/b
    {
      input: 'oklab(50% -100% -100%)',
      expected: { model: 'oklab', l: 0.5, a: -0.4, b: -0.4 },
    },
    // Lightness percentages at or below 1% stay percentages
    {
      input: 'oklch(1% 0 0)',
      expected: { model: 'oklch', l: 0.01, c: 0, h: 0 },
    },
    {
      input: 'oklch(0.5% 0 0)',
      expected: { model: 'oklch', l: 0.005, c: 0, h: 0 },
    },
    {
      input: 'oklab(1% 0 0)',
      expected: { model: 'oklab', l: 0.01, a: 0, b: 0 },
    },
    // Out-of-range lightness is kept as written
    {
      input: 'oklch(150% 0 0)',
      expected: { model: 'oklch', l: 1.5, c: 0, h: 0 },
    },
    {
      input: 'oklab(-1% 0 0)',
      expected: { model: 'oklab', l: -0.01, a: 0, b: 0 },
    },
    {
      input: 'oklch(50 0.1 180)',
      expected: { model: 'oklch', l: 50, c: 0.1, h: 180 },
    },
    {
      input: 'oklab(1.2 0 0)',
      expected: { model: 'oklab', l: 1.2, a: 0, b: 0 },
    },
    {
      input: 'oklch(-0.2 0 0)',
      expected: { model: 'oklch', l: -0.2, c: 0, h: 0 },
    },
    {
      input: 'hsla(344 ,   100%,    50%   ,  0.4)',
      expected: { model: 'hsl', h: 344, s: 100, l: 50, alpha: 0.4 },
    },
    // Angle units for HSL hue
    {
      input: 'hsl(120deg 100% 50%)',
      expected: { model: 'hsl', h: 120, s: 100, l: 50 },
    },
    {
      input: 'hsl(0.5turn 100% 50%)',
      expected: { model: 'hsl', h: 180, s: 100, l: 50 },
    },
    {
      input: 'hsl(3.141592653589793rad 100% 50%)',
      expected: { model: 'hsl', h: 180, s: 100, l: 50 },
    },
    {
      input: 'hsl(200grad 100% 50%)',
      expected: { model: 'hsl', h: 180, s: 100, l: 50 },
    },
    // Angle units for OkLCH hue
    {
      input: 'oklch(0.5 0.2 180deg)',
      expected: { model: 'oklch', l: 0.5, c: 0.2, h: 180 },
    },
    {
      input: 'oklch(0.5 0.2 0.5turn)',
      expected: { model: 'oklch', l: 0.5, c: 0.2, h: 180 },
    },
    {
      input: 'oklch(0.5 0.2 3.141592653589793rad)',
      expected: { model: 'oklch', l: 0.5, c: 0.2, h: 180 },
    },
    // none keyword (CSS Color Level 4)
    {
      input: 'rgb(none 128 255)',
      expected: { model: 'rgb', r: 0, g: 128, b: 255 },
    },
    {
      input: 'hsl(none 50% 50%)',
      expected: { model: 'hsl', h: 0, s: 50, l: 50 },
    },
    {
      input: 'oklab(none 0.1 -0.1)',
      expected: { model: 'oklab', l: 0, a: 0.1, b: -0.1 },
    },
    {
      input: 'oklch(0.5 none 180)',
      expected: { model: 'oklch', l: 0.5, c: 0, h: 180 },
    },
    // Function names are case-insensitive
    {
      input: 'RGB(255 0 0)',
      expected: { model: 'rgb', r: 255, g: 0, b: 0 },
    },
    {
      input: 'Hsla(120 50% 50% / 0.5)',
      expected: { model: 'hsl', h: 120, s: 50, l: 50, alpha: 0.5 },
    },
    {
      input: 'OKLCH(50% 0 0)',
      expected: { model: 'oklch', l: 0.5, c: 0, h: 0 },
    },
    {
      input: 'OkLab(50% 0.1 -0.1)',
      expected: { model: 'oklab', l: 0.5, a: 0.1, b: -0.1 },
    },
    // Chroma and a/b percentages scale without capping; negative chroma is kept as written
    {
      input: 'oklab(50% 200% 0%)',
      expected: { model: 'oklab', l: 0.5, a: 0.8, b: 0 },
    },
    {
      input: 'oklch(50% 150% 180)',
      expected: { model: 'oklch', l: 0.5, c: 0.6, h: 180 },
    },
    {
      input: 'oklch(0.7 0.5 30)',
      expected: { model: 'oklch', l: 0.7, c: 0.5, h: 30 },
    },
    {
      input: 'oklch(0.7 -0.1 30)',
      expected: { model: 'oklch', l: 0.7, c: -0.1, h: 30 },
    },
    {
      input: 'oklch(0.7 -50% 30)',
      expected: { model: 'oklch', l: 0.7, c: -0.2, h: 30 },
    },
    {
      input: 'oklab(0.7 0.5 -0.6)',
      expected: { model: 'oklab', l: 0.7, a: 0.5, b: -0.6 },
    },
    // Keywords and units are case-insensitive
    {
      input: 'oklch(NONE 0 0)',
      expected: { model: 'oklch', l: 0, c: 0, h: 0 },
    },
    {
      input: 'oklch(0.5 0.1 None)',
      expected: { model: 'oklch', l: 0.5, c: 0.1, h: 0 },
    },
    {
      input: 'oklch(0.5 0 0 / NONE)',
      expected: { model: 'oklch', l: 0.5, c: 0, h: 0, alpha: 0 },
    },
    {
      input: 'oklch(0.5 0.1 0.5TURN)',
      expected: { model: 'oklch', l: 0.5, c: 0.1, h: 180 },
    },
    {
      input: 'oklch(0.5 0.1 0.25Turn)',
      expected: { model: 'oklch', l: 0.5, c: 0.1, h: 90 },
    },
    {
      input: 'hsl(100GRAD 50% 50%)',
      expected: { model: 'hsl', h: 90, s: 50, l: 50 },
    },
    {
      input: 'hsl(3.141592653589793Rad 50% 50%)',
      expected: { model: 'hsl', h: 180, s: 50, l: 50 },
    },
    {
      input: 'hsl(90DEG 50% 50%)',
      expected: { model: 'hsl', h: 90, s: 50, l: 50 },
    },
    {
      input: 'oklch(1E-1 0 0)',
      expected: { model: 'oklch', l: 0.1, c: 0, h: 0 },
    },
    // CSS <number> syntax: sign, leading '.', and scientific notation
    {
      input: 'rgb(+255 .5e2 2.55E2)',
      expected: { model: 'rgb', r: 255, g: 50, b: 255 },
    },
    {
      input: 'oklch(5e1% 1e-1 1.8e2deg / 5e-1)',
      expected: { model: 'oklch', l: 0.5, c: 0.1, h: 180, alpha: 0.5 },
    },
    {
      input: 'oklab(-.5e-1 -1e-1 +.1)',
      expected: { model: 'oklab', l: -0.05, a: -0.1, b: 0.1 },
    },
    // Hue as written, not rounded
    {
      input: 'hsl(10.123456 50% 50%)',
      expected: { model: 'hsl', h: 10.123456, s: 50, l: 50 },
    },
    // Surrounding CSS whitespace
    {
      input: '\t rgb(255 0 0)\n',
      expected: { model: 'rgb', r: 255, g: 0, b: 0 },
    },
  ])('should return properly for $input', ({ input, expected }) => {
    expect(extractColorParts(input)).toEqual(expected);
  });

  it.each([
    { input: 'red', expected: { model: 'rgb', r: 255, g: 0, b: 0 } },
    { input: '  RED  ', expected: { model: 'rgb', r: 255, g: 0, b: 0 } },
    { input: '\tcoral\n', expected: { model: 'rgb', r: 255, g: 127, b: 80 } },
  ])('should return named color $input as RGB parts', ({ input, expected }) => {
    expect(extractColorParts(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    expect(() => extractColorParts('notacolor')).toThrow(MESSAGES.invalidCSS);

    expect(() => extractColorParts('rgb(255, 255)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(255, 255, aa)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('hsl(255, 80)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklab(0.34, 0.5)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklch(34%, 0.5)')).toThrow(MESSAGES.invalidCSS);

    // Malformed numbers
    expect(() => extractColorParts('oklch(63%% 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklch(6%3 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklch(.% 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklch(-% 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(2-5 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(12. 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(+-12 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(1.2.3 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(1e 0 0)')).toThrow(MESSAGES.invalidCSS);

    // Angle units outside hue
    expect(() => extractColorParts('rgb(10deg 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('hsl(120 50deg 50%)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklch(0.5turn 0 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklch(0.5 0.1GRAD 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklab(0.5 1rad 0)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(0 0 0 / 50deg)')).toThrow(MESSAGES.invalidCSS);

    // Percentages on hue
    expect(() => extractColorParts('hsl(50% 50% 50%)')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('oklch(0.5 0.1 50%)')).toThrow(MESSAGES.invalidCSS);

    // Text around the color
    expect(() => extractColorParts('foo rgb(1 2 3) bar')).toThrow(MESSAGES.invalidCSS);
    expect(() => extractColorParts('rgb(1 2 3);')).toThrow(MESSAGES.invalidCSS);

    // Non-finite values
    expect(() => extractColorParts('rgb(1e999 0 0)')).toThrow(MESSAGES.invalidRange);
  });
});
