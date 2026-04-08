import deltaE, { DELTA_E_JND } from '~/delta-e';
import { MESSAGES } from '~/modules/constants';

describe('deltaE', () => {
  it('should return 0 for identical colors', () => {
    expect(deltaE('#ff0000', '#ff0000')).toBe(0);
    expect(deltaE('#000000', '#000000')).toBe(0);
    expect(deltaE('oklch(50% 0.2 120)', 'oklch(50% 0.2 120)')).toBe(0);
  });

  it('should return a large value for black vs white', () => {
    const result = deltaE('#000000', '#ffffff');

    expect(result).toBeGreaterThan(0.9);
    expect(result).toBeLessThan(1.1);
  });

  it('should return a small value for similar colors', () => {
    const result = deltaE('#ff0000', '#fe0000');

    expect(result).toBeLessThan(DELTA_E_JND);
  });

  it('should return values below JND for perceptually identical colors', () => {
    expect(deltaE('#808080', '#818181')).toBeLessThan(DELTA_E_JND);
  });

  it('should return larger values for more different colors', () => {
    const similar = deltaE('#ff0000', '#ff3300');
    const different = deltaE('#ff0000', '#00ff00');

    expect(different).toBeGreaterThan(similar);
  });

  it('should be symmetric', () => {
    expect(deltaE('#ff0000', '#0000ff')).toBe(deltaE('#0000ff', '#ff0000'));
  });

  it('should work with different input formats', () => {
    const hex = deltaE('#ff0000', '#0000ff');
    const rgb = deltaE('rgb(255, 0, 0)', 'rgb(0, 0, 255)');
    const hsl = deltaE('hsl(0, 100%, 50%)', 'hsl(240, 100%, 50%)');

    expect(hex).toBe(rgb);
    expect(hex).toBe(hsl);
  });

  it('should handle named colors', () => {
    expect(deltaE('red', 'blue')).toBe(deltaE('#ff0000', '#0000ff'));
  });

  it('should respect precision parameter', () => {
    const result = deltaE('#ff0000', '#0000ff', 2);
    const decimals = result.toString().split('.')[1]?.length ?? 0;

    expect(decimals).toBeLessThanOrEqual(2);
  });

  it('should fail with invalid inputs', () => {
    expect(() => deltaE('', '#fff')).toThrow(MESSAGES.left);
    expect(() => deltaE('#fff', '')).toThrow(MESSAGES.right);
    // @ts-expect-error - invalid parameters
    expect(() => deltaE(123, '#fff')).toThrow(MESSAGES.left);
  });

  it('should export DELTA_E_JND constant', () => {
    expect(DELTA_E_JND).toBe(0.02);
  });
});
