import saturate from 'saturate';

import { messages } from 'modules/utils';

describe('saturate', () => {
  it.each([
    ['#ccc', 10, '#d1c7c7'],
    ['#ff0044', 10, '#ff0044'],
    ['rgb(255, 0, 68)', 10, '#ff0044'],
    ['hsl(344, 100, 50)', 10, '#ff0044'],
    ['pink', 10, '#ffc0cb'],
  ])('%p with %p should return %p', (input, amount, expected) => {
    expect(saturate(input, amount)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => saturate([])).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => saturate('', {})).toThrow(messages.amount);
  });
});
