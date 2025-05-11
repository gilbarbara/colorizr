import oklch2rgb from '~/converters/oklch2rgb';
import { MESSAGES } from '~/modules/constants';

import { ColorTuple, LCH, RGB } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2rgb', () => {
  it.each([
    [brightPink.oklch, brightPink.rgb],
    [brightPink.oklchLong, brightPink.rgb],
    [green.oklch, green.rgb],
    [green.oklchLong, green.rgb],
    [orange.oklch, orange.rgb],
    [orange.oklchLong, orange.rgb],
    [violet.oklch, violet.rgb],
    [violet.oklchLong, violet.rgb],
    [yellow.oklch, yellow.rgb],
    [yellow.oklchLong, yellow.rgb],
    [
      { l: 0, c: 0, h: 0 },
      { r: 0, g: 0, b: 0 },
    ],
  ] as Array<[LCH, RGB]>)('%s should return %s', (input, expected) => {
    expect(oklch2rgb(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklch), brightPink.rgb],
    [Object.values(green.oklch), green.rgb],
    [Object.values(orange.oklch), orange.rgb],
    [Object.values(violet.oklch), violet.rgb],
    [Object.values(yellow.oklch), yellow.rgb],
  ] as Array<[ColorTuple, RGB]>)('%s should return %s', (input, expected) => {
    expect(oklch2rgb(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklch2rgb()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2rgb('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2rgb({ m: 255, p: 55, b: 75 })).toThrow('invalid oklch color');
  });
});
