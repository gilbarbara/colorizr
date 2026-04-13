import contrast from '~/contrast';
import { MESSAGES } from '~/modules/constants';

describe('contrast', () => {
  it.each([
    { left: 'black', right: '#111', expected: 1.11 },
    { left: '#ff0044', right: '#24d3d3', expected: 2.12 },
    { left: 'rgb(255, 0, 68)', right: '#24d3d3', expected: 2.12 },
    { left: 'hsl(344, 100, 50)', right: '#24d3d3', expected: 2.12 },
    { left: '#ff0044', right: '#005cff', expected: 1.34 },
    { left: '#ff0044', right: 'hsl(0, 0, 100)', expected: 3.94 },
    { left: '#ff0044', right: 'rgba(0, 0, 0)', expected: 5.34 },
    { left: '#24d3d3', right: '#d32424', expected: 2.8 },
    { left: '#99bfff', right: '#004cc2', expected: 4 },
    { left: 'white', right: '#000', expected: 21 },
    { left: 'black', right: '#fff', expected: 21 },
  ])('$left with $right should return $expected', ({ left, right, expected }) => {
    expect(contrast(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => contrast([])).toThrow(MESSAGES.left);
    expect(() => contrast('white', '')).toThrow(MESSAGES.right);
  });
});
