import hex2hsl from 'hex2hsl';

import { messages } from 'modules/utils';

describe('hex2hsl', () => {
  it.each([
    ['#ff0044', { h: 344, s: 100, l: 50 }],
    ['#abc', { h: 210, s: 25, l: 73.33 }],
    ['#fff', { h: 0, s: 0, l: 100 }],
    ['#000', { h: 0, s: 0, l: 0 }],
  ])('%p should return %p', (input, expected) => {
    expect(hex2hsl(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    expect(() => hex2hsl('#mmxxvv')).toThrow('invalid hex');
    // @ts-ignore
    expect(() => hex2hsl([255, 255, 0])).toThrow(messages.inputString);
  });
});
