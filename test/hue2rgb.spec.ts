import hue2rgb from '~/modules/hue2rgb';

describe('hue2rgb', () => {
  it('should return median', () => {
    expect(hue2rgb(0.1, 0.4, 0.1)).toBe(0.28);
    expect(hue2rgb(0.2, 0.4, 0.1)).toBe(0.32);
    expect(hue2rgb(0.8, 1, 0.9)).toBe(0.8);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => hue2rgb()).toThrow('point, chroma and h are required');
    // @ts-expect-error - invalid parameters
    expect(() => hue2rgb(0.8)).toThrow('point, chroma and h are required');
    // @ts-expect-error - invalid parameters
    expect(() => hue2rgb(0.8, 1)).toThrow('point, chroma and h are required');
  });
});
