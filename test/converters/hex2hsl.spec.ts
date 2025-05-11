import hex2hsl from '~/converters/hex2hsl';
import { MESSAGES } from '~/modules/constants';

import { HEX, HSL } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2hsl', () => {
  it.each([
    [brightPink.hex, brightPink.hsl],
    [green.hex, green.hsl],
    [orange.hex, orange.hsl],
    [violet.hex, violet.hsl],
    [yellow.hex, yellow.hsl],
    ['#fff', { h: 0, s: 0, l: 100 }],
    ['#000', { h: 0, s: 0, l: 0 }],
  ] as Array<[HEX, HSL]>)('%s should return %s', (input, expected) => {
    expect(hex2hsl(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hex2hsl()).toThrow(MESSAGES.inputHex);
    // @ts-expect-error - invalid parameters
    expect(() => hex2hsl([255, 255, 0])).toThrow(MESSAGES.inputHex);
    expect(() => hex2hsl('#mmxxvv')).toThrow(MESSAGES.inputHex);
  });
});
