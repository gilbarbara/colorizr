import compare from '~/compare';
import { MESSAGES } from '~/modules/constants';

describe('compare', () => {
  it.each([
    { left: '#ff0044', right: 'rgb(221, 0, 255)' },
    { left: 'rgb(255, 0, 68)', right: '#00ffbb' },
    { left: 'hsl(344, 100%, 50%)', right: 'oklch(1 0 0)' },
    { left: '#ff0044', right: 'oklab(0 0 0)' },
    { left: '#fff', right: 'rgb(119, 119, 119)' },
    { left: 'oklab(0 0 0)', right: 'oklch(1 0 0)' },
  ])('$left with $right should return an analysis', ({ left, right }) => {
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
