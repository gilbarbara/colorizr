import isValidColor from 'is-valid-color';

describe('isValidColor', () => {
  it.each([
    ['#ff0044', true],
    ['#ff004400', true],
    ['rgb(100, 255, 0)', true],
    ['hsla(344, 100%, 50%)', true],
    ['blue', true],
    ['aliceblue', true],
    ['#mmff00', false],
    ['blue-ish', false],
    [[], false],
    [{}, false],
  ])('%p should be %p', (input, expected) => {
    expect(isValidColor(input)).toBe(expected);
  });
});
