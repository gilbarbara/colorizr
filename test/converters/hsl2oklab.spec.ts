import { MESSAGES } from '~/modules/constants';

import hsl2oklab from '~/converters/hsl2oklab';
import { ColorTuple, HSL, LAB } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2oklab', () => {
  it.each([
    [brightPink.hsl, brightPink.oklab],
    [green.hsl, green.oklab],
    [orange.hsl, orange.oklab],
    [violet.hsl, violet.oklab],
    [yellow.hsl, yellow.oklab],
    [
      { h: 0, s: 0, l: 0 },
      { l: 0, a: 0, b: 0 },
    ],
  ] as Array<[HSL, LAB]>)('%s should return %s', (input, expected) => {
    expect(hsl2oklab(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.hsl), brightPink.oklab],
    [Object.values(green.hsl), green.oklab],
    [Object.values(orange.hsl), orange.oklab],
    [Object.values(violet.hsl), violet.oklab],
    [Object.values(yellow.hsl), yellow.oklab],
  ] as Array<[ColorTuple, LAB]>)('%s should return %s', (input, expected) => {
    expect(hsl2oklab(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2oklab()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2oklab('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => hsl2oklab({ m: 255, p: 55, b: 75 })).toThrow('invalid hsl color');
  });
});
