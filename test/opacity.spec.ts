import { MESSAGES } from '~/modules/constants';
import opacity from '~/opacity';

describe('opacity', () => {
  it.each([
    { input: '#ff0044', expected: 1 },
    { input: '#ff0044cc', expected: 0.8 },
    { input: 'rgb(255 0 153)', expected: 1 },
    { input: 'rgb(255 0 153 / 80%)', expected: 0.8 },
    { input: 'rgb(255, 100, 0)', expected: 1 },
    { input: 'rgba(255,   100,   0,   0.5)', expected: 0.5 },
    { input: 'hsl(150 30% 60%)', expected: 1 },
    { input: 'hsl(150, 30%, 60%)', expected: 1 },
    { input: 'hsla(344, 100% 50%, 0.5)', expected: 0.5 },
    { input: 'hsl(150 30% 60% / 30%)', expected: 0.3 },
    { input: 'oklab(59% 0.1 0.1)', expected: 1 },
    { input: 'oklab(0.87 -0.23 0.16)', expected: 1 },
    { input: 'oklab(59% 0.1 0.1 / 0.5)', expected: 0.5 },
    { input: 'oklch(60% 0.15 50)', expected: 1 },
    { input: 'oklch(60% 0.15 50 / 0.5)', expected: 0.5 },
    { input: 'pink', expected: 1 },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(opacity(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => opacity([])).toThrow(MESSAGES.inputString);
    expect(() => opacity('')).toThrow(MESSAGES.inputString);
    expect(() => opacity('vermelho')).toThrow(MESSAGES.invalidCSS);
  });
});
