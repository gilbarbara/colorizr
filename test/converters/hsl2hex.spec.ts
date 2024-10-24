import { MESSAGES } from '~/modules/constants';

import hsl2hex from '~/converters/hsl2hex';
import { ColorTuple } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hsl2hex', () => {
  it.each([
    [brightPink.hsl, brightPink.hex],
    [green.hsl, green.hex],
    [orange.hsl, orange.hex],
    [violet.hsl, violet.hex],
    [yellow.hsl, yellow.hex],
    [{ h: 0, s: 0, l: 100 }, '#ffffff'],
  ])('%s should return %s', (input, expected) => {
    expect(hsl2hex(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.hsl), brightPink.hex],
    [Object.values(green.hsl), green.hex],
    [Object.values(orange.hsl), orange.hex],
    [Object.values(violet.hsl), violet.hex],
    [Object.values(yellow.hsl), yellow.hex],
  ] as Array<[ColorTuple, string]>)('%s should return %s', (input, expected) => {
    expect(hsl2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hsl2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => hsl2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid parameters
    expect(() => hsl2hex({ m: 255, p: 55, b: 75 })).toThrow('invalid hsl color');
  });
});
