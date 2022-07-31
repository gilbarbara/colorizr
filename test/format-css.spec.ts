import formatCSS from 'format-css';

describe('formatCSS', () => {
  it('should work with proper input', () => {
    expect(formatCSS({ h: 344, s: 100, l: 50 })).toBe('hsl(344, 100%, 50%)');
    expect(formatCSS({ h: 344, s: 100, l: 50 }, { alpha: 0.5 })).toBe('hsla(344, 100%, 50%, 0.5)');
    expect(formatCSS({ h: 344, s: 100, l: 50 }, { model: 'rgb' })).toBe('rgb(255, 0, 68)');
    expect(formatCSS({ h: 344, s: 100, l: 50 }, { alpha: 0.5, model: 'rgb' })).toBe(
      'rgba(255, 0, 68, 0.5)',
    );

    expect(formatCSS({ r: 255, g: 0, b: 68 })).toBe('rgb(255, 0, 68)');
    expect(formatCSS({ r: 255, g: 0, b: 68 }, { alpha: 0.5 })).toBe('rgba(255, 0, 68, 0.5)');
    expect(formatCSS({ r: 255, g: 0, b: 68 }, { model: 'hsl' })).toBe('hsl(344, 100%, 50%)');
    expect(formatCSS({ r: 255, g: 0, b: 68 }, { alpha: 0.5, model: 'hsl' })).toBe(
      'hsla(344, 100%, 50%, 0.5)',
    );
  });

  it('should throw with invalid input', () => {
    // @ts-ignore
    expect(() => formatCSS('#ff0044')).toThrow('invalid input');
    // @ts-ignore
    expect(() => formatCSS({ r: 10, g: 10, s: 10 })).toThrow('invalid input');
  });
});
