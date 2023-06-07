import hsl2hex from 'converters/hsl2hex';
import { messages } from 'modules/utils';

describe('hsl2hex', () => {
  it.each([
    [{ h: 344, s: 100, l: 50 }, '#ff0044'],
    [{ h: 210, s: 25, l: 73.33 }, '#aabbcc'],
    [{ h: 0, s: 0, l: 100 }, '#ffffff'],
    [{ h: 0, s: 0, l: 0 }, '#000000'],
  ])('%p should return %p', (input, expected) => {
    expect(hsl2hex(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => hsl2hex('hpv(255, 255, 0)')).toThrow(messages.invalid);
    // @ts-ignore
    expect(() => hsl2hex({ m: 255, p: 55, b: 75 })).toThrow(messages.invalid);
  });
});
