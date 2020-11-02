import desaturate from '../src/desaturate';
import { messages } from '../src/utils';

describe('desaturate', () => {
  it.each([
    ['#d1c7c7', 10, '#cccccc'],
    ['#ff0044', 10, '#f20d4a'],
    ['rgb(255, 0, 68)', 10, '#f20d4a'],
    ['hsl(344, 100, 50)', 10, '#f20d4a'],
    ['pink', 10, '#fcc3cd'],
  ])('%p with %p should return %p', (input, amount, expected) => {
    expect(desaturate(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => desaturate([])).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => desaturate('', {})).toThrow(messages.amount);
  });
});
