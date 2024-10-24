import {
  isHex,
  isHSL,
  isLAB,
  isLCH,
  isNumber,
  isPlainObject,
  isRGB,
  isString,
} from '~/modules/validators';

import { addOpacityToCssString, brightPink, green, violet, yellow } from '../__fixtures__';

describe('isHex', () => {
  it.each([
    { hex: '#aabbcc', expected: true },
    { hex: brightPink.hex, expected: true },
    { hex: '#f04', expected: true },
    { hex: addOpacityToCssString(brightPink.hex, 0.5), expected: true },
    { hex: '#f040', expected: true },
    { hex: '#mmff00', expected: false },
    { hex: '00ff00', expected: false },
    { hex: '74422', expected: false },
  ])('$hex should be $expected', ({ hex, expected }) => {
    expect(isHex(hex)).toBe(expected);
  });

  it('should validate invalid input', () => {
    // @ts-expect-error
    expect(isHex()).toBe(false);
    expect(isHex([])).toBe(false);
    expect(isHex({})).toBe(false);
  });
});

describe('isHSL', () => {
  it('should detect properly', () => {
    expect(isHSL(green.hsl)).toBe(true);
    expect(isHSL({ ...green.hsl, alpha: 0.8 })).toBe(true);
    expect(isHSL({ h: 20, s: 100, l: 150 })).toBe(false);
    expect(isHSL({ h: -20, s: 100, l: 50 })).toBe(false);
    expect(isHSL({ h: 20, s: 100, x: 50 })).toBe(false);
    expect(isHSL(green.oklchString)).toBe(false);
    expect(isHSL(green.rgb)).toBe(false);
    expect(isHSL(green.hex)).toBe(false);
  });
});

describe('isLAB', () => {
  it('should detect properly', () => {
    expect(isLAB(violet.oklabLong)).toBe(true);
    expect(isLAB(violet.oklab)).toBe(true);
    expect(isLAB({ ...violet.oklab, alpha: 0.9 })).toBe(true);
    expect(isLAB(violet.oklabString)).toBe(false);
    expect(isLAB({ l: 100, a: 100, b: 100 })).toBe(false);
    expect(isLAB({})).toBe(false);
    expect(isLAB([])).toBe(false);
    expect(isLAB('')).toBe(false);
  });
});

describe('isLHC', () => {
  it('should detect properly', () => {
    expect(isLCH(yellow.oklchLong)).toBe(true);
    expect(isLCH(yellow.oklch)).toBe(true);
    expect(isLCH({ ...yellow.oklch, alpha: 0.8 })).toBe(true);
    expect(isLCH(yellow.oklchString)).toBe(false);
    expect(isLCH({ l: 100, c: 100, h: 100 })).toBe(false);
    expect(isLCH({})).toBe(false);
    expect(isLCH([])).toBe(false);
    expect(isLCH('')).toBe(false);
  });
});

describe('isNumber', () => {
  it('should detect numbers', () => {
    expect(isNumber(10)).toBe(true);
    expect(isNumber('10')).toBe(false);
    expect(isNumber({})).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('should detect objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject('')).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });
});

describe('isString', () => {
  it('should detect string', () => {
    expect(isString('', false)).toBe(true);
    expect(isString('')).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
});

describe('isRGB', () => {
  it('should detect properly', () => {
    expect(isRGB(brightPink.rgb)).toBe(true);
    expect(isRGB({ ...brightPink.rgb, alpha: 0.1 })).toBe(true);
    expect(isRGB({ r: 20, g: 100, b: 500 })).toBe(false);
    expect(isRGB({ r: -20, g: 100, b: 50 })).toBe(false);
    expect(isRGB({ r: 20, g: 100, x: 50 })).toBe(false);
    expect(isRGB({ h: 20, s: 100, l: 50 })).toBe(false);
    expect(isRGB(brightPink.hex)).toBe(false);
  });
});
