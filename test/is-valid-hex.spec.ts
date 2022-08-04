import isValidHex from 'is-valid-hex';

describe('isValidHex', () => {
  it.each([
    { hex: '#aabbcc', alpha: false, expected: true },
    { hex: '#f040', alpha: false, expected: false },
    { hex: '#f040', alpha: true, expected: true },
    { hex: '#ff0044', alpha: false, expected: true },
    { hex: '#ff004400', alpha: false, expected: false },
    { hex: '#ff004400', alpha: true, expected: true },
    { hex: '#mmff00', alpha: false, expected: false },
    { hex: '00ff00', alpha: false, expected: false },
    { hex: '74422', alpha: false, expected: false },
  ])('$hex with alpha: "$alpha" should be $expected', ({ hex, alpha, expected }) => {
    expect(isValidHex(hex, alpha)).toBe(expected);
  });

  it('should validate invalid input', () => {
    // @ts-ignore
    expect(isValidHex()).toBe(false);
    expect(isValidHex([])).toBe(false);
    expect(isValidHex({})).toBe(false);
  });
});
