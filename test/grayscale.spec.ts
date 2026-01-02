import grayscale from '~/grayscale';
import { MESSAGES } from '~/modules/constants';

import { brightPink, green, orange, violet, yellow } from './__fixtures__';

describe('grayscale', () => {
  it.each([
    [brightPink.hex, '#8a8a8a'],
    [green.hslString, 'hsl(0 0% 83.14%)'],
    [orange.oklabString, 'oklab(70.622% 0 0)'],
    [violet.oklchString, 'oklch(47.642% 0 274.93693)'],
    [yellow.rgbString, 'rgb(229 229 229)'],
  ])('%s should return %s', (input, expected) => {
    expect(grayscale(input)).toBe(expected);
  });

  it('should handle achromatic colors', () => {
    expect(grayscale('#ffffff')).toBe('#ffffff');
    expect(grayscale('#000000')).toBe('#000000');
    expect(grayscale('#808080')).toBe('#808080');
  });

  it('should handle named colors', () => {
    expect(grayscale('red')).toBe('#888888');
  });

  it('should preserve format', () => {
    expect(grayscale('hsl(180, 50%, 50%)')).toBe('hsl(0 0% 66.67%)');
    expect(grayscale('rgb(100, 150, 200)')).toBe('rgb(145 145 145)');
    expect(grayscale('oklch(50% 0.2 180)')).toBe('oklch(50% 0 180)');
  });

  it('should allow format override', () => {
    expect(grayscale('#ff0000', 'hsl')).toBe('hsl(0 0% 53.33%)');
    expect(grayscale('#ff0000', 'oklch')).toBe('oklch(62.796% 0 29.23494)');
  });

  it('should preserve alpha', () => {
    expect(grayscale('rgba(255, 0, 0, 0.5)')).toBe('rgb(136 136 136 / 50%)');
    expect(grayscale('#ff000080')).toBe('#88888880');
  });

  it('should fail with invalid parameters', () => {
    expect(() => grayscale('')).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => grayscale(123)).toThrow(MESSAGES.inputString);
  });
});
