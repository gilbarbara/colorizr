import formatHex from '~/format-hex';
import { MESSAGES } from '~/modules/constants';

import { HEX } from '~/types';

describe('formatHex', () => {
  it.each([
    ['#f05', '#ff0055'],
    ['#f0a', '#ff00aa'],
    ['#abc', '#aabbcc'],
    ['#07e', '#0077ee'],
    ['#f058', '#ff005588'],
    ['#f0a0', '#ff00aa00'],
    ['#abcf', '#aabbccff'],
    ['#07eb', '#0077eebb'],
    ['#aabbcc', '#aabbcc'],
    ['#ff0044', '#ff0044'],
    ['#00ff00', '#00ff00'],
    ['#774422', '#774422'],
    ['#aabbcc88', '#aabbcc88'],
    ['#ff0044ff', '#ff0044ff'],
    ['#00ff0000', '#00ff0000'],
    ['#774422bb', '#774422bb'],
  ] as Array<[string, HEX]>)('should format %s to %s', (input, expected) => {
    expect(formatHex(input)).toBe(expected);
  });

  it('should throw with invalid input', () => {
    // @ts-expect-error - no parameters
    expect(() => formatHex()).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('#xyz')).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('blue')).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('#xml')).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('taa')).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('@jsl')).toThrow(MESSAGES.inputHex);
  });
});
