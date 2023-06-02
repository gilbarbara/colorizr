import hex2rgb from 'hex2rgb';
import { messages } from 'modules/utils';

describe('hex2rgb', () => {
  it.each([
    ['#ff0044', { r: 255, g: 0, b: 68 }],
    ['#abc', { r: 170, g: 187, b: 204 }],
    ['#fff', { r: 255, g: 255, b: 255 }],
    ['#000', { r: 0, g: 0, b: 0 }],
  ])('%p should return %p', (input, expected) => {
    expect(hex2rgb(input)).toEqual(expected);
  });

  it('should throw with invalid input', () => {
    expect(() => hex2rgb('abs')).toThrow('invalid hex');
    // @ts-ignore
    expect(() => hex2rgb({ h: 240, s: 45, l: 50 })).toThrow(messages.inputString);
  });
});
