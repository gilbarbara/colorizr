import rgb2hex from 'rgb2hex';

import { messages } from 'modules/utils';

describe('rgb2hex', () => {
  it('should work with proper input', () => {
    expect(rgb2hex({ r: 255, g: 55, b: 75 })).toBe('#ff374b');
    expect(rgb2hex([255, 0, 68])).toBe('#ff0044');
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => rgb2hex()).toThrow(messages.input);

    // @ts-ignore
    expect(() => rgb2hex('hpv(255, 255, 0)')).toThrow(messages.invalid);
    expect(() => rgb2hex({ r: 500, g: 55, b: 75 })).toThrow(messages.invalid);

    // @ts-ignore
    expect(() => rgb2hex({ m: 255, p: 55, b: 75 })).toThrow(messages.invalid);
    expect(() => rgb2hex([300, 100, 0])).toThrow(messages.invalid);
  });
});
