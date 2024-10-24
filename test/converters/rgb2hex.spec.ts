import { MESSAGES } from '~/modules/constants';

import rgb2hex from '~/converters/rgb2hex';
import { ColorTuple } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('rgb2hex', () => {
  it.each([
    [brightPink.rgb, brightPink.hex],
    [green.rgb, green.hex],
    [orange.rgb, orange.hex],
    [violet.rgb, violet.hex],
    [yellow.rgb, yellow.hex],
    [{ r: 0, g: 0, b: 0 }, '#000000'],
  ])('%s should return %s', (input, expected) => {
    expect(rgb2hex(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.rgb), brightPink.hex],
    [Object.values(green.rgb), green.hex],
    [Object.values(orange.rgb), orange.hex],
    [Object.values(violet.rgb), violet.hex],
    [Object.values(yellow.rgb), yellow.hex],
  ] as Array<[ColorTuple, string]>)('%s should return %s', (input, expected) => {
    expect(rgb2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => rgb2hex()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid color
    expect(() => rgb2hex('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // invalid color
    expect(() => rgb2hex({ r: 500, g: 55, b: 75 })).toThrow('invalid rgb color');
  });
});
