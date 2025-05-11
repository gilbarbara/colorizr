import { MESSAGES } from '~/modules/constants';
import rotate from '~/rotate';

describe('rotate', () => {
  it.each([
    ['#ff0044', 10, '#ff001a'],
    ['#ff0044', 30, '#ff3b00'],
    ['#ff0044', 90, '#c4ff00'],
    ['#ff0044', 180, '#00ffbb'],
    ['#ff0044', 360, '#ff0044'],
  ])('should have rotate %s with %d to %s', (input, degrees, expected) => {
    expect(rotate(input, degrees)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => rotate({})).toThrow(MESSAGES.inputString);
    // @ts-expect-error - invalid parameters
    expect(() => rotate('#f04', [])).toThrow('degrees must be a number');
  });
});
