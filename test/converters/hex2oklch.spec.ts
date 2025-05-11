import hex2oklch from '~/converters/hex2oklch';
import { MESSAGES } from '~/modules/constants';

import { HEX, LCH } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2oklch', () => {
  it.each([
    [brightPink.hex, brightPink.oklch],
    [green.hex, green.oklch],
    [orange.hex, orange.oklch],
    [violet.hex, violet.oklch],
    [yellow.hex, yellow.oklch],
    ['#fff', { l: 1, c: 0, h: 0 }],
    ['#000', { l: 0, c: 0, h: 0 }],
  ] as Array<[HEX, LCH]>)('%s should return %s', (input, expected) => {
    expect(hex2oklch(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hex2oklch()).toThrow(MESSAGES.inputHex);

    expect(() => hex2oklch('#mmxxvv')).toThrow(MESSAGES.inputHex);
    // @ts-expect-error - invalid parameters
    expect(() => hex2oklch([255, 255, 0])).toThrow(MESSAGES.inputHex);
  });
});
