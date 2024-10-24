import { MESSAGES } from '~/modules/constants';

import colorDifference from '~/color-difference';

describe('colorDifference', () => {
  it.each([
    ['#ff0044', '#fff', 442],
    ['#fff', '#000', 765],
    ['#FF9D64', '#000', 512],
    ['#ff0044', '#dd00ff', 221],
    ['green', 'lightcoral', 368],
  ])('%s with %s should return %s', (left, right, expected) => {
    expect(colorDifference(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => colorDifference('')).toThrow(MESSAGES.left);
    expect(() => colorDifference('black', '')).toThrow(MESSAGES.right);
  });
});
