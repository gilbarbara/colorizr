import colorDifference from 'color-difference';

import { messages } from 'modules/utils';

describe('colorDifference', () => {
  it.each([
    ['#ff0044', '#fff', 442],
    ['#fff', '#000', 765],
    ['#FF9D64', '#000', 512],
    ['#ff0044', '#dd00ff', 221],
    ['green', 'lightcoral', 368],
  ])('%p with %p should return %p', (left, right, expected) => {
    expect(colorDifference(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => colorDifference([])).toThrow(messages.left);
    // @ts-ignore
    expect(() => colorDifference('', {})).toThrow(messages.right);
  });
});
