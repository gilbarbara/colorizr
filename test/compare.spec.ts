import { MESSAGES } from '~/modules/constants';

import compare from '~/compare';

describe('compare', () => {
  it.each([
    ['#ff0044', 'rgb(221, 0, 255)'],
    ['rgb(255, 0, 68)', '#00ffbb'],
    ['hsl(344, 100%, 50%)', 'oklch(1 0 0)'],
    ['#ff0044', 'oklab(0 0 0)'],
    ['#fff', 'rgb(119, 119, 119)'],
    ['oklab(0 0 0)', 'oklch(1 0 0)'],
  ])('%s with %s should return an analysis', (left, right) => {
    expect(compare(left, right)).toMatchSnapshot();
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - no parameters
    expect(() => compare()).toThrow(MESSAGES.left);
    // @ts-expect-error - invalid parameters
    expect(() => compare([])).toThrow(MESSAGES.left);
    // @ts-expect-error - invalid parameters
    expect(() => compare('#f04', [])).toThrow(MESSAGES.right);
  });
});
