import { messages } from 'modules/utils';
import { shift } from 'shift';

describe('shift', () => {
  it.each([
    ['#ff0044', { h: 30 }, '#ff8000'],
    ['#ff0044', { s: 30 }, '#a6596e'],
    ['#ff0044', { l: 20 }, '#66001b'],
  ])('%p with %p should change the color to %p', (input, options, expected) => {
    // @ts-ignore
    expect(shift(input, options)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => shift('ABC', [])).toThrow(messages.options);
  });
});
