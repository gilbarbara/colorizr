import { MESSAGES } from 'modules/utils';
import name from 'name';

describe('name', () => {
  it.each([
    ['#ccc', '#ccc'],
    ['#ff0044', '#ff0044'],
    ['rgb(255, 0, 68)', '#ff0044'],
    ['hsl(344, 100, 50)', '#ff0044'],
    ['#ffc0cb', 'pink'],
    ['rgb(176, 224, 230)', 'powderblue'],
  ])('%p should return %p', (input, expected) => {
    expect(name(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => name([])).toThrow(MESSAGES.inputString);
  });
});
