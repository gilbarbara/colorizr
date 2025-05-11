import hsl2oklch from '~/converters/hsl2oklch';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, HSL, LCH } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2oklch', () => {
  it.each([
    [brightPink.hsl, brightPink.oklch],
    [green.hsl, green.oklch],
    [orange.hsl, orange.oklch],
    [violet.hsl, violet.oklch],
    [yellow.hsl, yellow.oklch],
    [
      { h: 0, s: 0, l: 0 },
      { l: 0, c: 0, h: 0 },
    ],
  ] as Array<[HSL, LCH]>)('%s should return %s', (input, expected) => {
    expect(hsl2oklch(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.hsl), brightPink.oklch],
    [Object.values(green.hsl), green.oklch],
    [Object.values(orange.hsl), orange.oklch],
    [Object.values(violet.hsl), violet.oklch],
    [Object.values(yellow.hsl), yellow.oklch],
  ] as Array<[ColorTuple, LCH]>)('%s should return %s', (input, expected) => {
    expect(hsl2oklch(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2oklch()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => hsl2oklch('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2oklch({ m: 255, p: 55, b: 75 })).toThrow('invalid hsl color');
  });
});
