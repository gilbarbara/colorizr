import hsl2rgb from '~/converters/hsl2rgb';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, RGB } from '~/types';

import { alphaCases, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2rgb', () => {
  it.each([
    [brightPink.hsl, brightPink.rgb],
    [green.hsl, green.rgb],
    [orange.hsl, orange.rgb],
    [violet.hsl, violet.rgb],
    [yellow.hsl, yellow.rgb],
    [
      { h: 0, s: 0, l: 0 },
      { r: 0, g: 0, b: 0 },
    ],
  ])('%s should return %s', (input, expected) => {
    expect(hsl2rgb(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.hsl), brightPink.rgb],
    [Object.values(green.hsl), green.rgb],
    [Object.values(orange.hsl), orange.rgb],
    [Object.values(violet.hsl), violet.rgb],
    [Object.values(yellow.hsl), yellow.rgb],
  ] as Array<[ColorTuple, RGB]>)('%s should return %s', (input, expected) => {
    expect(hsl2rgb(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2rgb()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2rgb('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2rgb({ m: 255, p: 55, b: 75 })).toThrow('invalid color: hsl');
  });

  describe('alpha handling', () => {
    it.each([
      [
        { ...brightPink.hsl, alpha: alphaCases.semi },
        { ...brightPink.rgb, alpha: alphaCases.semi },
      ],
      [
        { ...green.hsl, alpha: alphaCases.semi },
        { ...green.rgb, alpha: alphaCases.semi },
      ],
    ])('%s should return %s', (input, expected) => {
      expect(hsl2rgb(input)).toEqual(expected);
    });

    it('should not include alpha when alpha is 1', () => {
      const result = hsl2rgb({ ...brightPink.hsl, alpha: alphaCases.opaque });

      expect(result).toEqual(brightPink.rgb);
      expect(result).not.toHaveProperty('alpha');
    });

    it('should handle alpha=0 (fully transparent)', () => {
      const result = hsl2rgb({ ...brightPink.hsl, alpha: alphaCases.transparent });

      expect(result).toEqual({ ...brightPink.rgb, alpha: alphaCases.transparent });
    });
  });
});
