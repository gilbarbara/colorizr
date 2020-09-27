import brightnessDifference from '../src/brightness-difference';
import { messages } from '../src/utils';

describe('brightnessDifference', () => {
  it.each([
    ['#ff0044', 'rgba(255, 255, 255, 1)', 171.003],
    ['rgb(255, 0, 68)', '#fff', 171.003],
    ['hsl(344, 100, 50)', '#fff', 171.003],
    ['#ff0044', 'hsla(0, 0, 0, 1)', 83.997],
    ['#ff0044', 'black', 83.997],
    ['BlanchedAlmond', 'AliceBlue', 8.846],
  ])('%p with %p should return %p', (left, right, expected) => {
    expect(brightnessDifference(left, right)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => brightnessDifference([])).toThrow(messages.left);
    // @ts-ignore
    expect(() => brightnessDifference('', {})).toThrow(messages.right);
  });
});
