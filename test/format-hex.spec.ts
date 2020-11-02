import formatHex from '../src/format-hex';
import { messages } from '../src/utils';

describe('formatHex', () => {
  it.each([
    ['#f05', '#ff0055'],
    ['f0a', '#ff00aa'],
    ['#abc', '#aabbcc'],
    ['#07e', '#0077ee'],
    ['#f058', '#ff005588'],
    ['f0a0', '#ff00aa00'],
    ['#abcf', '#aabbccff'],
    ['#07eb', '#0077eebb'],
    ['#aabbcc', '#aabbcc'],
    ['#ff0044', '#ff0044'],
    ['00ff00', '#00ff00'],
    ['#774422', '#774422'],
    ['#aabbcc88', '#aabbcc88'],
    ['#ff0044ff', '#ff0044ff'],
    ['00ff0000', '#00ff0000'],
    ['#774422bb', '#774422bb'],
  ])('%p should return %p', (input, expected) => {
    expect(formatHex(input)).toBe(expected);
  });

  it('should throw with invalid input', () => {
    // @ts-ignore
    expect(() => formatHex()).toThrow(messages.inputString);
    expect(() => formatHex('#xyz')).toThrow('invalid hex');
    expect(() => formatHex('blue')).toThrow('invalid hex');
    expect(() => formatHex('#xml')).toThrow('invalid hex');
    expect(() => formatHex('taa')).toThrow('invalid hex');
    expect(() => formatHex('@jsl')).toThrow('invalid hex');
  });
});
