import formatHex from '~/format-hex';
import { MESSAGES } from '~/modules/constants';

describe('formatHex', () => {
  it.each([
    { input: 'f05', expected: '#ff0055' },
    { input: '#f0a', expected: '#ff00aa' },
    { input: '#abc', expected: '#aabbcc' },
    { input: '#07e', expected: '#0077ee' },
    { input: 'f058', expected: '#ff005588' },
    { input: '#f0a0', expected: '#ff00aa00' },
    { input: '#abcf', expected: '#aabbccff' },
    { input: '#07eb', expected: '#0077eebb' },
    { input: 'aabbcc', expected: '#aabbcc' },
    { input: '#ff0044', expected: '#ff0044' },
    { input: '#00ff00', expected: '#00ff00' },
    { input: '#774422', expected: '#774422' },
    { input: 'aabbcc88', expected: '#aabbcc88' },
    { input: '#ff0044ff', expected: '#ff0044ff' },
    { input: '#00ff0000', expected: '#00ff0000' },
    { input: '#774422bb', expected: '#774422bb' },
  ])('should format $input to $expected', ({ input, expected }) => {
    expect(formatHex(input)).toBe(expected);
  });

  it('should throw with invalid input', () => {
    // @ts-expect-error - no parameters
    expect(() => formatHex()).toThrow(MESSAGES.inputString);
    expect(() => formatHex('#xyz')).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('blue')).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('#xml')).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('taa')).toThrow(MESSAGES.inputHex);
    expect(() => formatHex('@jsl')).toThrow(MESSAGES.inputHex);
  });
});
