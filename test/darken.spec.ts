import darken from 'darken';
import { MESSAGES } from 'modules/utils';

describe('darken', () => {
  it.each([
    ['#ccc', 10, '#b3b3b3'],
    ['#ff0044', 10, '#cc0036'],
    ['rgb(255, 0, 68)', 10, '#cc0036'],
    ['hsl(344, 100, 50)', 10, '#cc0036'],
    ['pink', 10, '#ff8da1'],
  ])('%p with %p should return %p', (input, amount, expected) => {
    expect(darken(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => darken([])).toThrow(MESSAGES.inputString);
    // @ts-ignore
    expect(() => darken('', {})).toThrow(MESSAGES.amount);
  });
});
