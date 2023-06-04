import contrast from 'contrast';
import { messages } from 'modules/utils';

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
  ])('%p with %p should return %p', (left, right, expected) => {
    expect(contrast(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => contrast([])).toThrow(messages.left);
    // @ts-ignore
    expect(() => contrast('', {})).toThrow(messages.right);
  });
});
