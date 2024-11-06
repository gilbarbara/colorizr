import { MESSAGES } from '~/modules/constants';

import oklch2hex from '~/converters/oklch2hex';
import { ColorTuple, HEX, LCH } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklch2hex', () => {
  it.each([
    [brightPink.oklch, brightPink.hex],
    [brightPink.oklchLong, brightPink.hex],
    [green.oklch, green.hex],
    [green.oklchLong, green.hex],
    [orange.oklch, orange.hex],
    [orange.oklchLong, orange.hex],
    [violet.oklch, violet.hex],
    [violet.oklchLong, violet.hex],
    [yellow.oklch, yellow.hex],
    [yellow.oklchLong, yellow.hex],
    [{ l: 0, c: 0, h: 0 }, '#000000'],
  ] as Array<[LCH, HEX]>)('%s should return %s', (input, expected) => {
    expect(oklch2hex(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklch), brightPink.hex],
    [Object.values(green.oklch), green.hex],
    [Object.values(orange.oklch), orange.hex],
    [Object.values(violet.oklch), violet.hex],
    [Object.values(yellow.oklch), yellow.hex],
  ] as Array<[ColorTuple, string]>)('%s should return %s', (input, expected) => {
    expect(oklch2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklch2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklch2hex({ m: 255, p: 55, b: 75 })).toThrow('invalid oklch color');
  });
});
