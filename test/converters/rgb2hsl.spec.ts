import rgb2hsl from 'converters/rgb2hsl';
import { messages } from 'modules/utils';

describe('rgb2hsl', () => {
  it('should work with proper input', () => {
    expect(rgb2hsl({ r: 255, g: 55, b: 75 })).toEqual({ h: 354, s: 100, l: 60.78 });
    expect(rgb2hsl({ r: 55, g: 255, b: 75 })).toEqual({ h: 126, s: 100, l: 60.78 });
    expect(rgb2hsl({ r: 55, g: 255, b: 255 })).toEqual({ h: 180, s: 100, l: 60.78 });
    expect(rgb2hsl({ r: 153, g: 0, b: 41 })).toEqual({ h: 343.92, s: 100, l: 30 });
    expect(rgb2hsl([255, 0, 68])).toEqual({ h: 344, s: 100, l: 50 });
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => rgb2hsl('rgt(255, 255, 0)')).toThrow(messages.invalid);
    // @ts-ignore
    expect(() => rgb2hsl({ m: 255, t: 55, p: 75 })).toThrow(messages.invalid);
  });
});
