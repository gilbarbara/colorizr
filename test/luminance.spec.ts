import luminance from '~/luminance';
import { MESSAGES } from '~/modules/constants';

describe('luminance', () => {
  it.each([
    { input: '#ff0044', expected: 0.2168 },
    { input: '#24d3d3', expected: 0.5167 },
    { input: '#005cff', expected: 0.1487 },
    { input: '#fff', expected: 1 },
    { input: '#000', expected: 0 },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(luminance(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => luminance()).toThrow(MESSAGES.inputString);
  });
});
