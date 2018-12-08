import { expr, isPlainObject, isRequired, pick, round, validateHex } from '../src/utils';

describe('expr', () => {
  it('should return the correct value', () => {
    expect(expr('10+20')).toBe(30);
    expect(expr('10*20')).toBe(200);
    expect(expr('100-20')).toBe(80);
    expect(expr('10/15')).toEqual(0.6666666666666666);
    expect(expr('100|20')).toBe(100);
  });
});

describe('isPlainObject', () => {
  it('should work with proper parameters', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject('')).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });
});

describe('pick', () => {
  it('should fail with empty options', () => {
    expect(() => pick({ a: 1 }, 'a')).toThrow();
  });

  it('should work with proper parameters', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 });
    expect(pick({ a: 1, b: 2, c: 3 }, ['c', 'b'])).toEqual({ b: 2, c: 3 });
    expect(pick({ a: 1, b: 2, c: 3 }, ['d', 'e'])).toEqual({});
  });
});

describe('round', () => {
  it('should work', () => {
    expect(round(100.291, 2)).toBe(100.29);
    expect(round(1.21792011, 2)).toBe(1.22);
    expect(round(1.21298011, 4)).toBe(1.213);
  });
});

describe('validateHex', () => {
  it('should validate correctly', () => {
    expect(validateHex('#aabbcc')).toBe(true);
    expect(validateHex('#ff0044')).toBe(true);
    expect(validateHex('#mmff00')).toBe(false);
    expect(validateHex('00ff00')).toBe(false);
    expect(validateHex('74422')).toBe(false);
    expect(validateHex()).toBe(false);
  });
});

describe('isRequired', () => {
  it('should throw when executed', () => {
    expect(() => isRequired('name')).toThrow('name is required');
    expect(() => isRequired()).toThrow('parameter is required');
  });
});
