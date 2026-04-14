import { srgbGammaDecode, srgbGammaEncode } from '~/modules/gamma';

describe('srgbGammaDecode', () => {
  it('should return 0 for 0', () => {
    expect(srgbGammaDecode(0)).toBe(0);
  });

  it('should return 1 for 1', () => {
    expect(srgbGammaDecode(1)).toBe(1);
  });

  it('should use linear segment below threshold', () => {
    // 0.04045 is at the breakpoint — with strict <, it takes the power branch
    expect(srgbGammaDecode(0.02)).toBeCloseTo(0.02 / 12.92, 15);
  });

  it('should use power segment above threshold', () => {
    expect(srgbGammaDecode(0.5)).toBeCloseTo(0.21404114048223255, 12);
  });

  it('should be continuous at the 0.04045 breakpoint', () => {
    const below = srgbGammaDecode(0.04045 - 1e-10);
    const at = srgbGammaDecode(0.04045);
    const above = srgbGammaDecode(0.04045 + 1e-10);

    expect(Math.abs(at - below)).toBeLessThan(1e-8);
    expect(Math.abs(above - at)).toBeLessThan(1e-8);
  });

  it('should preserve sign for negative inputs', () => {
    expect(srgbGammaDecode(-0.5)).toBeCloseTo(-0.21404114048223255, 12);
    expect(srgbGammaDecode(-0.01)).toBeCloseTo(-0.01 / 12.92, 15);
  });
});

describe('srgbGammaEncode', () => {
  it('should return 0 for 0', () => {
    expect(srgbGammaEncode(0)).toBe(0);
  });

  it('should return ~1 for 1', () => {
    expect(srgbGammaEncode(1)).toBeCloseTo(1, 15);
  });

  it('should use linear segment below threshold', () => {
    expect(srgbGammaEncode(0.001)).toBeCloseTo(0.001 * 12.92, 15);
  });

  it('should use power segment above threshold', () => {
    const result = srgbGammaEncode(0.214);

    expect(result).toBeCloseTo(1.055 * 0.214 ** (1 / 2.4) - 0.055, 12);
  });

  it('should be continuous at the 0.0031308 breakpoint', () => {
    const below = srgbGammaEncode(0.0031308 - 1e-10);
    const at = srgbGammaEncode(0.0031308);
    const above = srgbGammaEncode(0.0031308 + 1e-10);

    expect(Math.abs(at - below)).toBeLessThan(1e-7);
    expect(Math.abs(above - at)).toBeLessThan(1e-7);
  });

  it('should preserve sign for negative inputs', () => {
    const positive = srgbGammaEncode(0.214);

    expect(srgbGammaEncode(-0.214)).toBeCloseTo(-positive, 12);
    expect(srgbGammaEncode(-0.001)).toBeCloseTo(-0.001 * 12.92, 15);
  });
});

describe('roundtrip', () => {
  it.each([0, 0.01, 0.04045, 0.1, 0.25, 0.5, 0.75, 1])(
    'should roundtrip encode/decode for %s',
    value => {
      expect(srgbGammaEncode(srgbGammaDecode(value))).toBeCloseTo(value, 10);
    },
  );

  it('should roundtrip negative values', () => {
    expect(srgbGammaEncode(srgbGammaDecode(-0.5))).toBeCloseTo(-0.5, 10);
  });
});
