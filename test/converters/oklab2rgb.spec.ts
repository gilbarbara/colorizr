import { MESSAGES } from '~/modules/constants';

import oklab2rgb from '~/converters/oklab2rgb';
import { ColorTuple, LAB, RGB } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2rgb', () => {
  it.each([
    [brightPink.oklab, brightPink.rgb],
    [brightPink.oklabLong, brightPink.rgb],
    [green.oklab, green.rgb],
    [green.oklabLong, green.rgb],
    [orange.oklab, orange.rgb],
    [orange.oklabLong, orange.rgb],
    [violet.oklab, violet.rgb],
    [violet.oklabLong, violet.rgb],
    [yellow.oklab, yellow.rgb],
    [yellow.oklabLong, yellow.rgb],

    [
      { l: 0, a: 0, b: 0 },
      { r: 0, g: 0, b: 0 },
    ],
  ] as Array<[LAB, RGB]>)('%s should return %s', (input, expected) => {
    expect(oklab2rgb(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklab), brightPink.rgb],
    [Object.values(green.oklab), green.rgb],
    [Object.values(orange.oklab), orange.rgb],
    [Object.values(violet.oklab), violet.rgb],
    [Object.values(yellow.oklab), yellow.rgb],
  ] as Array<[ColorTuple, RGB]>)('%s should return %s', (input, expected) => {
    expect(oklab2rgb(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklab2rgb()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2rgb('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2rgb({ m: 255, p: 55, b: 75 })).toThrow('invalid oklab color');
  });
});
