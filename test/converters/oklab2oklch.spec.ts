import oklab2oklch from '~/converters/oklab2oklch';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LAB, LCH } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2oklch', () => {
  it.each([
    [brightPink.oklab, brightPink.oklch],
    [brightPink.oklabLong, brightPink.oklch],
    [green.oklab, green.oklch],
    [green.oklabLong, green.oklch],
    [orange.oklab, orange.oklch],
    [orange.oklabLong, orange.oklch],
    [violet.oklab, violet.oklch],
    [violet.oklabLong, violet.oklch],
    [yellow.oklab, yellow.oklch],
    [yellow.oklabLong, yellow.oklch],
    [
      { l: 0, a: 0, b: 0 },
      { l: 0, c: 0, h: 0 },
    ],
  ] as Array<[LAB, LCH]>)('%s should return %s', (input, expected) => {
    expect(oklab2oklch(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklab), brightPink.oklch],
    [Object.values(green.oklab), green.oklch],
    [Object.values(orange.oklab), orange.oklch],
    [Object.values(violet.oklab), violet.oklch],
    [Object.values(yellow.oklab), yellow.oklch],
  ] as Array<[ColorTuple, LCH]>)('%s should return %s', (input, expected) => {
    expect(oklab2oklch(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklab2oklch()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2oklch('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2oklch({ m: 255, p: 55, b: 75 })).toThrow('invalid oklab color');
  });
});
