import colorDifference from '~/color-difference';
import { MESSAGES } from '~/modules/constants';

describe('colorDifference', () => {
  it.each([
    { left: '#ff0044', right: '#fff', expected: 442 },
    { left: '#fff', right: '#000', expected: 765 },
    { left: '#FF9D64', right: '#000', expected: 512 },
    { left: '#ff0044', right: '#dd00ff', expected: 221 },
    { left: 'green', right: 'lightcoral', expected: 368 },
  ])('$left with $right should return $expected', ({ left, right, expected }) => {
    expect(colorDifference(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => colorDifference('')).toThrow(MESSAGES.left);
    expect(() => colorDifference('black', '')).toThrow(MESSAGES.right);
  });
});
