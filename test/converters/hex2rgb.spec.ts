import { MESSAGES } from '~/modules/constants';

import hex2rgb from '~/converters/hex2rgb';
import { HEX, RGB } from '~/types';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('hex2rgb', () => {
  it.each([
    [brightPink.hex, brightPink.rgb],
    [green.hex, green.rgb],
    [orange.hex, orange.rgb],
    [violet.hex, violet.rgb],
    [yellow.hex, yellow.rgb],
    ['#fff', { r: 255, g: 255, b: 255 }],
    ['#000', { r: 0, g: 0, b: 0 }],
  ] as Array<[HEX, RGB]>)('%s should return %s', (input, expected) => {
    expect(hex2rgb(input)).toEqual(expected);
  });

  it('should throw with invalid input', () => {
    expect(() => hex2rgb('abs')).toThrow(MESSAGES.inputHex);
    // @ts-expect-error - invalid parameters
    expect(() => hex2rgb({ h: 240, s: 45, l: 50 })).toThrow(MESSAGES.inputHex);
  });
});
