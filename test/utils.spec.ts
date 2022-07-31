import {
  constrain,
  constrainDegrees,
  expr,
  invariant,
  isHSL,
  isNumber,
  isPlainObject,
  isRGB,
  isRGBArray,
  isString,
  limit,
  pick,
  round,
} from 'modules/utils';

describe('constrain', () => {
  it('should constrain the input', () => {
    expect(constrain(90, 10, [0, 100], '-')).toBe(80);
    expect(constrain(105, 0, [0, 100], '-')).toBe(100);
    expect(constrain(150, 20, [0, 100], '-')).toBe(100);
  });
});

describe('constrainDegrees', () => {
  it('should constrain degrees', () => {
    expect(constrainDegrees(350, 29)).toBe(19);
    expect(constrainDegrees(20, -80)).toBe(300);
    expect(constrainDegrees(20, 429)).toBe(89);
  });
});

describe('expr', () => {
  it('should return the correct value', () => {
    expect(expr('10+20')).toBe(30);
    expect(expr('10*20')).toBe(200);
    expect(expr('100-20')).toBe(80);
    expect(expr('10/15')).toBe(0.6666666666666666);
    expect(expr('100|20')).toBe(100);
  });
});

describe('invariant', () => {
  afterAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should throw', () => {
    expect(() => invariant(false, 'Fails')).toThrow('Fails');
    // @ts-ignore
    expect(() => invariant(false)).toThrow('invariant requires an error message argument');
  });

  it('should throw with NODE_ENV production', () => {
    process.env.NODE_ENV = 'production';

    // @ts-ignore
    expect(() => invariant(false)).toThrow(
      'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.',
    );
  });

  it('should not throw', () => {
    expect(() => invariant(true, 'Fails')).not.toThrow('Fails');
  });
});

describe('isHSL', () => {
  it('should detect properly', () => {
    expect(isHSL({ h: 20, s: 100, l: 50 })).toBe(true);
    expect(isHSL({ h: 20, s: 100, l: 150 })).toBe(false);
    expect(isHSL({ h: -20, s: 100, l: 50 })).toBe(false);
    expect(isHSL({ h: 20, s: 100, x: 50 })).toBe(false);
    expect(isHSL({ r: 20, g: 100, b: 50 })).toBe(false);
    expect(isHSL('#ff0044')).toBe(false);
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
    expect(isString('')).toBe(true);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
});

describe('isRGB', () => {
  it('should detect properly', () => {
    expect(isRGB({ r: 20, g: 100, b: 50 })).toBe(true);
    expect(isRGB({ r: 20, g: 100, b: 500 })).toBe(false);
    expect(isRGB({ r: -20, g: 100, b: 50 })).toBe(false);
    expect(isRGB({ r: 20, g: 100, x: 50 })).toBe(false);
    expect(isRGB({ h: 20, s: 100, l: 50 })).toBe(false);
    expect(isRGB('#ff0044')).toBe(false);
  });
});

describe('isRGBArray', () => {
  it('should detect properly', () => {
    expect(isRGBArray([20, 55, 0])).toBe(true);
    expect(isRGBArray([255, 120, 255])).toBe(true);
    expect(isRGBArray([400, 120, 255])).toBe(false);
    expect(isRGBArray([255, -20, 255])).toBe(false);
  });
});

describe('limit', () => {
  it('should limit the input', () => {
    expect(limit(120, 'h')).toBe(120);
    expect(limit(400, 'h')).toBe(360);
    expect(limit(20, 's')).toBe(20);
    expect(limit(120, 's')).toBe(100);
    expect(limit(20, 'l')).toBe(20);
    expect(limit(120, 'l')).toBe(100);
    expect(limit(200, 'r')).toBe(200);
    expect(limit(360, 'r')).toBe(255);
    expect(limit(360, 'g')).toBe(255);
    expect(limit(360, 'b')).toBe(255);
    expect(() => limit(360, 'x')).toThrow('Invalid type');
  });
});

describe('pick', () => {
  it('should work with proper parameters', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 });
    expect(pick({ a: 1, b: 2, c: 3 }, ['c', 'b'])).toEqual({ b: 2, c: 3 });
    expect(pick({ a: 1, b: 2, c: 3 }, ['d', 'e'])).toEqual({});
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => pick({ a: 1 })).toThrow('options must be an array');
  });
});

describe('round', () => {
  it('should round the input', () => {
    expect(round(100.291, 2)).toBe(100.29);
    expect(round(1.21792011, 2)).toBe(1.22);
    expect(round(1.21298011, 4)).toBe(1.213);
  });
});
