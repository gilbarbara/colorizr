import { MESSAGES } from '~/modules/constants';

import oklab2hsl from '~/converters/oklab2hsl';
import { ColorTuple, HSL, LAB } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('oklab2hsl', () => {
  it.each([
    [brightPink.oklab, brightPink.hsl],
    [green.oklab, green.hsl],
    [orange.oklab, orange.hsl],
    [violet.oklab, violet.hsl],
    [yellow.oklab, yellow.hsl],
    [
      { l: 0, a: 0, b: 0 },
      { h: 0, s: 0, l: 0 },
    ],
  ] as Array<[LAB, HSL]>)('%s should return %s', (input, expected) => {
    expect(oklab2hsl(input)).toEqual(expected);
  });

  it.each([
    [Object.values(brightPink.oklab), brightPink.hsl],
    [Object.values(green.oklab), green.hsl],
    [Object.values(orange.oklab), orange.hsl],
    [Object.values(violet.oklab), violet.hsl],
    [Object.values(yellow.oklab), yellow.hsl],
  ] as Array<[ColorTuple, HSL]>)('%s should return %s', (input, expected) => {
    expect(oklab2hsl(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => oklab2hsl()).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2hsl('hpv(255, 255, 0)')).toThrow(MESSAGES.invalid);
    // @ts-expect-error - invalid input
    expect(() => oklab2hsl({ m: 255, p: 55, b: 75 })).toThrow('invalid oklab color');
  });
});
