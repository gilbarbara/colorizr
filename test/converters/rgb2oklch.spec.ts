import { MESSAGES } from '~/modules/constants';

import rgb2oklch from '~/converters/rgb2oklch';
import { ColorTuple, LCH, RGB } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2oklch', () => {
  it.each([
    [brightPink.rgb, brightPink.oklch],
    [green.rgb, green.oklch],
    [orange.rgb, orange.oklch],
    [violet.rgb, violet.oklch],
    [yellow.rgb, yellow.oklch],
  ] as Array<[RGB, LCH]>)('%s should return %s', (input, expected) => {
    expect(rgb2oklch(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.rgb), brightPink.oklch],
    [Object.values(green.rgb), green.oklch],
    [Object.values(orange.rgb), orange.oklch],
    [Object.values(violet.rgb), violet.oklch],
    [Object.values(yellow.rgb), yellow.oklch],
  ] as Array<[ColorTuple, LCH]>)('%s should return %s', (input, expected) => {
    expect(rgb2oklch(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => rgb2oklch()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2oklch('rgt(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => rgb2oklch({ m: 255, t: 55, p: 75 })).toThrow('invalid rgb color');
  });
});
