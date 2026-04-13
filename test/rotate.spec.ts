import { MESSAGES } from '~/modules/constants';
import rotate from '~/rotate';

describe('rotate', () => {
  it.each([
    { input: '#ff0044', degrees: 10, expected: '#ff001a' },
    { input: '#ff0044', degrees: 30, expected: '#ff3c00' },
    { input: '#ff0044', degrees: 90, expected: '#c3ff00' },
    { input: '#ff0044', degrees: 180, expected: '#00ffbb' },
    { input: '#ff0044', degrees: 360, expected: '#ff0044' },
  ])('should have rotate $input with $degrees to $expected', ({ input, degrees, expected }) => {
    expect(rotate(input, degrees)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => rotate({})).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => rotate('#f04', [])).toThrow(MESSAGES.degreesRange);
  });
});
