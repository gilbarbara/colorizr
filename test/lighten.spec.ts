import lighten from '../src/lighten';
import { messages } from '../src/utils';

describe('lighten', () => {
  it.each([
    ['#ccc', 10, '#e6e6e6'],
    ['#ff0044', 10, '#ff3369'],
    ['rgb(255, 0, 68)', 10, '#ff3369'],
    ['hsl(344, 100, 50)', 10, '#ff3369'],
    ['pink', 10, '#fff3f5'],
  ])('%p with %p should return %p', (input, amount, expected) => {
    expect(lighten(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => lighten([])).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => lighten('', {})).toThrow(messages.amount);
  });
});
