import hsl2rgb from 'hsl2rgb';

import { messages } from 'modules/utils';

describe('hsl2rgb', () => {
  it.each([
    [
      { h: 344, s: 100, l: 50 },
      { r: 255, g: 0, b: 68 },
    ],
    [
      { h: 210, s: 25, l: 73.33 },
      { r: 170, g: 187, b: 204 },
    ],
    [
      { h: 0, s: 0, l: 100 },
      { r: 255, g: 255, b: 255 },
    ],
    [
      { h: 0, s: 0, l: 0 },
      { r: 0, g: 0, b: 0 },
    ],
  ])('%p should return %p', (input, expected) => {
    expect(hsl2rgb(input)).toEqual(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => hsl2rgb('hpv(255, 255, 0)')).toThrow(messages.invalid);
    // @ts-ignore
    expect(() => hsl2rgb({ m: 255, p: 55, b: 75 })).toThrow(messages.invalid);
  });
});
