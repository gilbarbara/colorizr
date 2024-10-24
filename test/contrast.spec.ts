import { MESSAGES } from '~/modules/constants';

import contrast from '~/contrast';

describe('contrast', () => {
  it.each([
    ['black', '#111', 1.11],
    ['#ff0044', '#24d3d3', 2.12],
    ['rgb(255, 0, 68)', '#24d3d3', 2.12],
    ['hsl(344, 100, 50)', '#24d3d3', 2.12],
    ['#ff0044', '#005cff', 1.34],
    ['#ff0044', 'hsl(0, 0, 100)', 3.94],
    ['#ff0044', 'rgba(0, 0, 0)', 5.34],
    ['#24d3d3', '#d32424', 2.8],
    ['#99bfff', '#004cc2', 4],
    ['white', '#000', 21],
    ['black', '#fff', 21],
  ])('%s with %s should return %s', (left, right, expected) => {
    expect(contrast(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => contrast([])).toThrow(MESSAGES.left);
    expect(() => contrast('white', '')).toThrow(MESSAGES.right);
  });
});
