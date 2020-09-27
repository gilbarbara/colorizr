import isValidHex from '../src/is-valid-hex';

describe('isValidHex', () => {
  it.each([
    ['#aabbcc', true],
    ['#f040', true],
    ['#ff0044', true],
    ['#ff004400', true],
    ['#mmff00', false],
    ['00ff00', false],
    ['74422', false],
  ])('%p should be %p', (input, expected) => {
    expect(isValidHex(input)).toBe(expected);
  });

  it('should validate invalid input', () => {
    // @ts-ignore
    expect(isValidHex()).toBe(false);
    expect(isValidHex([])).toBe(false);
    expect(isValidHex({})).toBe(false);
  });
});
